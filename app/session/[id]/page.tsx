"use client";
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import ControlBarLite from '@/components/agent/ControlBarLite';
import CallScreen from '@/components/agent/CallScreen';
import type { Config, HeartbeatEvent, SessionResumedEvent, SessionDetails } from '@/lib/types';
import { LogLevel, WsStatus } from '@/lib/types';
import {
  useLocalStorage,
  useWebSocket,
  useAudioProcessor,
  useAudioPlayback,
  useSessionReconnection,
  useSessionMode,
  useApiClient,
  useVisibilityGuard,
  useWakeLock
} from '@/lib/hooks';
import { useSearchParams } from 'next/navigation';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { TelephoneSolid } from '@mynaui/icons-react';
import { PanelRightOpenSolid } from '@mynaui/icons-react';
import { routeWsMessage } from '@/lib/wsRouter';

export default function SessionDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientIdParam = searchParams?.get('clientId') || '';
  const [config, setConfig] = useLocalStorage<Config>('app-config', { scheme: 'wss', host: 'localhost', port: '443', appName: 'app', userId: 'user', sessionId: '' });

  // Consolidated UI and connection state
  const [uiState, setUiState] = useState({
    isMicHwOn: false,
    isStreamingOn: false,
    isConnecting: false,
    isDisconnecting: false,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    serverAlive: true,
    isListening: false,
    serverReady: false,
  });

  // Track tool-call activity as the single source of truth for gating
  const [isToolCallActive, setIsToolCallActive] = useState<boolean>(false);
  // In-call UI overlay state
  const [sessionStarted, setSessionStarted] = useState<boolean>(false);

  // Report state for this session
  const [reportDetails, setReportDetails] = useState<SessionDetails | null>(null);
  const [reportLoading, setReportLoading] = useState<boolean>(false);
  const [expandedReportSection, setExpandedReportSection] = useState<React.Key | null>('main_report');
  const [expandedStrategicSection, setExpandedStrategicSection] = useState<React.Key | null>('proactive_insights');

  const lastHeartbeatAtRef = useRef<number>(Date.now());
  const lastWsMessageAtRef = useRef<number>(Date.now());
  const micHwBeforeHideRef = useRef<boolean>(false);
  const streamingBeforeHideRef = useRef<boolean>(false);

  // Initialize hooks
  const addLog = useCallback((level: LogLevel, message: string, data?: unknown) => {
    if (process.env.NODE_ENV !== 'production') {
      try { console.debug(`[${level}] ${message}`, data ?? ''); } catch {}
    }
  }, []);

  // Backend API client for report fetching (userId is the clientId)
  const apiClient = useApiClient({
    scheme: (typeof window !== 'undefined' && window.location.protocol === 'https:') ? 'wss' : 'ws',
    host: 'env',
    port: '0',
    appName: 'app',
    userId: clientIdParam || 'user',
    sessionId: ''
  }, addLog);

  // Audio playback management
  const audioPlayback = useAudioPlayback(addLog);
  // Track last mic level for visualizer
  const lastLevelRef = React.useRef<number>(0);
  // Connected sound flags
  const pendingConnectedSoundRef = React.useRef<boolean>(false);
  const connectedSoundPlayedRef = React.useRef<boolean>(false);

  // Session mode management
  const sessionMode = useSessionMode(addLog);

  // Ensure sessionId matches URL
  React.useEffect(() => {
    const id = params?.id as string;
    if (id && config.sessionId !== id) setConfig(prev => ({ ...prev, sessionId: id }));
  }, [params?.id, config.sessionId, setConfig]);

  // Ensure userId matches clientId for WS routing
  React.useEffect(() => {
    const cid = clientIdParam;
    if (cid && config.userId !== cid) setConfig(prev => ({ ...prev, userId: cid }));
  }, [clientIdParam, config.userId, setConfig]);

  // Fetch report (once) for this session id
  React.useEffect(() => {
    const id = params?.id as string;
    if (!id || !clientIdParam) { setReportDetails(null); return; }
    setReportLoading(true);
    (async () => {
      const details = await apiClient.getSession(id) as SessionDetails | null;
      setReportDetails(details);
      setReportLoading(false);
    })().catch(() => setReportLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id, clientIdParam]);

  // Backend base detection (safe)
  const backendBase: string = useMemo(() => {
    try {
      const envVar = (process.env.NEXT_PUBLIC_BACKEND_BASE_URL as unknown as string) || '';
      if (envVar) return envVar.replace(/\/$/, '');
    } catch {}
    try {
      const win = window as unknown as { __ENV?: Record<string, string> };
      const fromWin = win.__ENV?.NEXT_PUBLIC_BACKEND_BASE_URL || '';
      if (fromWin) return fromWin.replace(/\/$/, '');
    } catch {}
    return '';
  }, []);

  const buildWsUrlSafe = useCallback((cfg: Config, base: string): string => {
    if (!base) return '';
    const proto = base.startsWith('https') ? 'wss' : 'ws';
    const host = base.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const params = new URLSearchParams();
    params.set('is_audio', 'true');
    return `${proto}://${host}/apps/${cfg.appName}/users/${cfg.userId}/sessions/${cfg.sessionId}/ws?${params.toString()}`;
  }, []);

  const wsUrl = useMemo(() => buildWsUrlSafe(config, backendBase), [config, backendBase, buildWsUrlSafe]);

  // Server handshake readiness
  const serverReadyRef = useRef<boolean>(uiState.serverReady);
  React.useEffect(() => { serverReadyRef.current = uiState.serverReady; }, [uiState.serverReady]);
  const isMicOnRef = useRef<boolean>(uiState.isStreamingOn);
  React.useEffect(() => { isMicOnRef.current = uiState.isStreamingOn; }, [uiState.isStreamingOn]);
  // Mirror of wsStatus for early callbacks before declaration
  const wsStatusRef = useRef<WsStatus>(WsStatus.Disconnected);

  // Bridge sendMessage to audio hook without TDZ issues
  const sendMessageRef = useRef<(data: unknown) => void>(() => {});
  const onMicData = useCallback((base64: string) => {
    const canSend = uiState.isOnline && serverReadyRef.current && uiState.serverAlive && isMicOnRef.current && !isToolCallActive && wsStatusRef.current === WsStatus.Connected;
    if (canSend) {
      sendMessageRef.current({ mime_type: 'audio/pcm', data: base64 });
    }
  }, [uiState.isOnline, uiState.serverAlive, isToolCallActive]);
  const { startMic, stopMic, playAudioChunk, clearPlaybackQueue, setStreamingEnabled } = useAudioProcessor(onMicData, addLog, (lvl) => { lastLevelRef.current = lvl; });

  // Initialize session reconnection hook
  const sessionReconnection = useSessionReconnection(
    addLog,
    startMic,
    stopMic,
    () => connect(),
    () => disconnect(),
    setStreamingEnabled,
    clearPlaybackQueue
  );

  // Define after useAudioProcessor to avoid TDZ; then assign in effect
  const onWsOpenRef = useRef<() => void>(() => {});

  React.useEffect(() => {
    onWsOpenRef.current = () => {
      addLog(LogLevel.Ws, 'WebSocket connected.');
      sessionMode.resetToIdle();
      setUiState(prev => ({ ...prev, serverReady: false, serverAlive: true }));
      lastHeartbeatAtRef.current = Date.now();
      addLog(LogLevel.Ws, 'Reset server liveness on reconnection');
    };
  }, [addLog, sessionMode]);

  React.useEffect(() => {
    const handleOnline = () => {
      setUiState(prev => ({ ...prev, isOnline: true }));
      addLog(LogLevel.Ws, 'Browser online', { online: true, visibility: typeof document !== 'undefined' ? document.visibilityState : undefined });
    };
    const handleOffline = () => {
      setUiState(prev => ({ ...prev, isOnline: false }));
      addLog(LogLevel.Ws, 'Browser offline', { online: false, visibility: typeof document !== 'undefined' ? document.visibilityState : undefined });
      sessionReconnection.manualDisconnect();
      audioPlayback.cleanup();
      sessionMode.setDisconnected();
      // Reset local flags
      setStreamingEnabled(false);
      setUiState(prev => ({ ...prev, serverReady: false, isMicHwOn: false, isStreamingOn: false }));
      pendingConnectedSoundRef.current = true;
      connectedSoundPlayedRef.current = false;
      setSessionStarted(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addLog, sessionReconnection, audioPlayback, sessionMode, setStreamingEnabled]);

  type WireMessage = { 
    event?: string; 
    name?: string; 
    turn_complete?: unknown; 
    interrupted?: unknown; 
    mime_type?: string; 
    data?: unknown;
    frames?: Array<{ mime_type: string; data: string }>;
    state?: SessionResumedEvent['state'];
  };

  // --- WebSocket Message Handlers ---
  const handleReady = useCallback(() => {
    addLog(LogLevel.Event, 'Server ready - audio can now be sent', {
      micOn: isMicOnRef.current,
      toolCallActive: audioPlayback.isToolCallActive(),
      wsStatus: wsStatusRef.current
    });
    if (sessionReconnection.isReconnecting && isMicOnRef.current) {
      setStreamingEnabled(true);
    }
    serverReadyRef.current = true;
    setUiState(prev => ({ ...prev, serverReady: true }));
  }, [addLog, audioPlayback, sessionReconnection, setStreamingEnabled]);

  const handleSessionResumed = useCallback((state: SessionResumedEvent['state']) => {
    addLog(LogLevel.Resume, 'Session resumed', state);
    sessionReconnection.handleSessionResumed(state);
  }, [addLog, sessionReconnection]);

  const handleSpeechControl = useCallback((event: 'speech_start' | 'speech_end') => {
    if (event === 'speech_start') {
      setUiState(prev => ({ ...prev, isListening: true }));
      clearPlaybackQueue();
    } else {
      setUiState(prev => ({ ...prev, isListening: false }));
    }
  }, [clearPlaybackQueue]);

  const handleAudioBuffer = useCallback((frames: Array<{ mime_type: string; data: string }>) => {
    const gateOk = wsStatusRef.current === WsStatus.Connected && uiState.isStreamingOn;
    addLog(LogLevel.Audio, 'Received audio_buffer frames', {
      count: Array.isArray(frames) ? frames.length : 0,
      gateOk,
      ws: wsStatusRef.current,
      streamingOn: uiState.isStreamingOn
    });
    if (!gateOk) {
      addLog(LogLevel.Audio, 'Dropped audio_buffer due to gate', {
        ws: wsStatusRef.current,
        streamingOn: uiState.isStreamingOn
      });
      return;
    }
    if (Array.isArray(frames) && frames.length > 0) {
      audioPlayback.playModelAudio();
      for (const f of frames) {
        if (f?.mime_type?.startsWith('audio/')) {
          playAudioChunk(f.data);
        }
      }
      sessionMode.startResponding(2500);
      setTimeout(() => audioPlayback.endModelAudio(), 2500);
      addLog(LogLevel.Event, 'Played audio_buffer frames', { count: frames.length });
    }
  }, [addLog, audioPlayback, playAudioChunk, sessionMode, uiState.isStreamingOn]);

  const handleHeartbeat = useCallback((msg: HeartbeatEvent) => {
    sendMessageRef.current({
      "event": "heartbeat_response",
      "timestamp": Date.now(),
      "server_timestamp": msg.timestamp
    });
    lastHeartbeatAtRef.current = Date.now();
    if (!uiState.serverAlive) setUiState(prev => ({ ...prev, serverAlive: true }));
    addLog(LogLevel.Event, 'Heartbeat received and responded', {
      server_timestamp: msg.timestamp,
      data: msg.data
    });
  }, [addLog, uiState.serverAlive]);

  const handleFunctionCall = useCallback(() => {
    sessionMode.startThinking();
    addLog(LogLevel.Audio, 'Disabling streaming');
    setIsToolCallActive(true);
    audioPlayback.startToolCall();
  }, [addLog, audioPlayback, sessionMode]);

  const handleFunctionResponse = useCallback(() => {
    audioPlayback.endToolCall();
    setIsToolCallActive(false);
    sessionMode.stopThinking();
  }, [audioPlayback, sessionMode]);
  
  const handleTurnControl = useCallback((msg: { turn_complete?: unknown; interrupted?: unknown; [k: string]: unknown }) => {
    addLog(LogLevel.Event, 'Turn Control', msg);
    if (msg?.interrupted) {
      clearPlaybackQueue();
    }
    audioPlayback.endToolCall();
    setIsToolCallActive(false);
    sessionMode.stopThinking();
  }, [addLog, audioPlayback, clearPlaybackQueue, sessionMode]);

  const handleAudioData = useCallback((msg: { mime_type?: string; data?: unknown }) => {
    const gateOk = wsStatusRef.current === WsStatus.Connected && uiState.isStreamingOn;
    const len = typeof msg?.data === 'string' ? (msg.data as string).length : 0;
    addLog(LogLevel.Audio, 'Received audio_data', { len, gateOk, ws: wsStatusRef.current, streamingOn: uiState.isStreamingOn });
    if (!gateOk) {
      addLog(LogLevel.Audio, 'Dropped audio_data due to gate', { ws: wsStatusRef.current, streamingOn: uiState.isStreamingOn });
      return;
    }
    if (msg.mime_type?.startsWith('audio/')) {
      audioPlayback.playModelAudio();
      playAudioChunk(msg.data as string);
      sessionMode.startResponding(2500);
      setTimeout(() => audioPlayback.endModelAudio(), 2500);
      addLog(LogLevel.Audio, 'Played audio_data chunk', { len });
    }
  }, [addLog, audioPlayback, playAudioChunk, sessionMode, uiState.isStreamingOn]);

  const onWsMessage = useCallback((data: unknown) => {
    lastWsMessageAtRef.current = Date.now();
    routeWsMessage(data, {
      ready: handleReady,
      session_resumed: (state) => state && handleSessionResumed(state as SessionResumedEvent['state']),
      speech_start: () => handleSpeechControl('speech_start'),
      speech_end: () => handleSpeechControl('speech_end'),
      audio_buffer: (frames) => handleAudioBuffer(frames),
      heartbeat: (msg) => handleHeartbeat(msg as HeartbeatEvent),
      function_call: handleFunctionCall,
      function_response: handleFunctionResponse,
      interrupt: clearPlaybackQueue,
      turn_control: handleTurnControl,
      audio_data: handleAudioData,
      fallback: (ev, payload) => addLog(LogLevel.Event, String(ev), payload)
    });
  }, [addLog, handleReady, handleSessionResumed, handleSpeechControl, handleAudioBuffer, handleHeartbeat, handleFunctionCall, handleFunctionResponse, clearPlaybackQueue, handleTurnControl, handleAudioData]);

  const onWsClose = useCallback((code?: number, reason?: string, wasManual?: boolean) => {
    const now = Date.now();
    const diagnostics = {
      code,
      reason,
      wasManual,
      online: typeof navigator !== 'undefined' ? navigator.onLine : undefined,
      visibility: typeof document !== 'undefined' ? document.visibilityState : undefined,
      wsStatus: wsStatusRef.current,
      micOn: isMicOnRef.current,
      serverReady: serverReadyRef.current,
      serverAlive: uiState.serverAlive,
      isToolCallActive,
      timeSinceHeartbeatMs: now - lastHeartbeatAtRef.current,
      timeSinceWsMessageMs: now - lastWsMessageAtRef.current,
      url: wsUrl
    };
    addLog(LogLevel.Ws, 'WebSocket disconnected', diagnostics);
    stopMic();
    audioPlayback.cleanup();
    addLog(LogLevel.Audio, 'Disabling streaming');
    // Explicit reset
    setStreamingEnabled(false);
    setUiState(prev => ({ ...prev, serverReady: false, isMicHwOn: false, isStreamingOn: false }));
    sessionMode.resetToIdle();
    clearPlaybackQueue();
    sessionReconnection.handleConnectionClose(code, reason, wasManual);
    // Prepare next connect sound and close overlay
    pendingConnectedSoundRef.current = true;
    connectedSoundPlayedRef.current = false;
    setSessionStarted(false);
  }, [addLog, stopMic, audioPlayback, setStreamingEnabled, sessionMode, clearPlaybackQueue, sessionReconnection, uiState.serverAlive, isToolCallActive, wsUrl]);

  const onWsError = useCallback((event?: Event) => addLog(LogLevel.Error, 'WebSocket error', event), [addLog]);
  const { connect, disconnect, sendMessage, status: wsStatus } = useWebSocket(wsUrl, () => onWsOpenRef.current(), onWsMessage, onWsClose, onWsError);
  React.useEffect(() => { wsStatusRef.current = wsStatus; }, [wsStatus]);

  React.useEffect(() => {
    sendMessageRef.current = (data: unknown) => sendMessage(data);
  }, [sendMessage]);

  // Ensure a clean slate before manualConnect: if an old connecting socket lingers, replace it
  const safeManualConnect = React.useCallback(async () => {
    try {
      await sessionReconnection.manualConnect(false);
    } catch (e) {
      addLog(LogLevel.Error, 'safeManualConnect failed', e);
      throw e;
    }
  }, [sessionReconnection, addLog]);

  React.useEffect(() => {
    const t = window.setInterval(() => {
      const since = Date.now() - lastHeartbeatAtRef.current;
      if (since > 20000 && uiState.serverAlive) setUiState(prev => ({ ...prev, serverAlive: false }));
    }, 5000);
    return () => { try { window.clearInterval(t); } catch {} };
  }, [uiState.serverAlive]);

  React.useEffect(() => {
    const shouldEnable = uiState.isOnline && wsStatus === WsStatus.Connected && uiState.serverReady && uiState.isMicHwOn && uiState.isStreamingOn && uiState.serverAlive && !isToolCallActive;
    setStreamingEnabled(shouldEnable);

    // Log gate changes with reasons (low-noise: only on change)
    const prevRef = (React as unknown as { __streamGatePrev?: { current: boolean } }).__streamGatePrev;
    if (!prevRef || typeof prevRef.current !== 'boolean' || prevRef.current !== shouldEnable) {
      addLog(LogLevel.Audio, `Streaming gate ${shouldEnable ? 'OPEN' : 'CLOSED'}`, {
        online: uiState.isOnline,
        wsConnected: wsStatus === WsStatus.Connected,
        serverReady: uiState.serverReady,
        micHwOn: uiState.isMicHwOn,
        streamingOn: uiState.isStreamingOn,
        serverAlive: uiState.serverAlive,
        toolCallActive: isToolCallActive
      });
    }
    (React as unknown as { __streamGatePrev?: { current: boolean } }).__streamGatePrev = { current: shouldEnable };

    // Play connected sound once when streaming becomes active after user-initiated Connect
    const prev = (React as any).__prevShouldEnable as { current?: boolean } | undefined;
    if (!prev || typeof prev.current !== 'boolean') { (React as any).__prevShouldEnable = { current: shouldEnable }; }
    const prevVal = prev?.current ?? false;
    if (!prevVal && shouldEnable && pendingConnectedSoundRef.current && !connectedSoundPlayedRef.current) {
      try { audioPlayback.playConnectedSound(); } catch {}
      connectedSoundPlayedRef.current = true;
      pendingConnectedSoundRef.current = false;
    }
    if (prev) prev.current = shouldEnable;
  }, [uiState.isOnline, wsStatus, uiState.serverReady, uiState.isMicHwOn, uiState.isStreamingOn, uiState.serverAlive, isToolCallActive, setStreamingEnabled, addLog, audioPlayback]);

  useWakeLock(addLog, sessionStarted && wsStatus === WsStatus.Connected);

  useVisibilityGuard(addLog, {
    pause: async () => {
      micHwBeforeHideRef.current = uiState.isMicHwOn;
      streamingBeforeHideRef.current = uiState.isStreamingOn;
      setStreamingEnabled(false);
      try { stopMic(); } catch {}
      setUiState(prev => ({ ...prev, isMicHwOn: false, isStreamingOn: false }));
      addLog(LogLevel.Ws, 'Page hidden - paused mic and streaming');
    },
    restore: async () => {
      addLog(LogLevel.Ws, 'Page visible - attempting restore');
      if (micHwBeforeHideRef.current && wsStatusRef.current === WsStatus.Connected && serverReadyRef.current) {
        try { await startMic(); setUiState(prev => ({ ...prev, isMicHwOn: true })); } catch {}
      }
      if (streamingBeforeHideRef.current) {
        setUiState(prev => ({ ...prev, isStreamingOn: true }));
      }
    },
    disconnect: async () => {
      try { sendMessageRef.current({ event: 'client_disconnect', intent: 'hidden_timeout' }); } catch {}
      sessionReconnection.manualDisconnect();
      pendingConnectedSoundRef.current = true;
      connectedSoundPlayedRef.current = false;
      setSessionStarted(false);
      addLog(LogLevel.Ws, 'Hidden grace expired - disconnected');
    },
    graceMs: 12000
  });

  // Reset to idle when mic state changes
  React.useEffect(() => {
    sessionMode.resetToIdle();
  }, [uiState.isStreamingOn, sessionMode]);

  React.useEffect(() => {
    if (wsStatus !== WsStatus.Connecting) setUiState(prev => ({ ...prev, isConnecting: false }));
    if (wsStatus === WsStatus.Disconnected) setUiState(prev => ({ ...prev, isDisconnecting: false }));
  }, [wsStatus]);

  const hasReport = !!reportDetails?.state?.RapportDeSortie;

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto p-4">
      <div className="flex-shrink-0 flex justify-end items-center mb-4">
        <Button
          className="w-auto md:w-auto gap-2 h-10 px-4 rounded-full shadow-xs"
          variant="default"
          onClick={() => router.replace(clientIdParam ? `/session?clientId=${clientIdParam}` : '/session')}
        >
          <PanelRightOpenSolid />
          Retour aux sessions
        </Button>
      </div>

      {hasReport ? (
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapport de Visite</CardTitle>
            </CardHeader>
            <CardContent>
              {reportLoading && <div className="text-sm text-muted-foreground">Chargement…</div>}
              {!reportLoading && reportDetails?.state?.RapportDeSortie && (
                <Accordion
                  className="space-y-3"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  variants={{ expanded: { opacity: 1, height: 'auto', y: 0 }, collapsed: { opacity: 0, height: 0, y: -8 } }}
                  expandedValue={expandedReportSection}
                  onValueChange={setExpandedReportSection}
                >
                  <AccordionItem value="main_report" className="rounded-md border">
                    <AccordionTrigger className="w-full text-left text-lg font-semibold px-4 py-3">Rapport principal</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-3 border-t">
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Titre :</span> {reportDetails.state.RapportDeSortie.main_report?.title}</div>
                        <div><span className="font-medium">Date :</span> {reportDetails.state.RapportDeSortie.main_report?.date_of_visit}</div>
                        <div><span className="font-medium">Agriculteur :</span> {reportDetails.state.RapportDeSortie.main_report?.farmer}</div>
                        <div><span className="font-medium">TC :</span> {reportDetails.state.RapportDeSortie.main_report?.tc}</div>
                        <div className="whitespace-pre-wrap"><span className="font-medium">Résumé :</span> {reportDetails.state.RapportDeSortie.main_report?.report_summary}</div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {reportDetails.state.RapportDeSortie.strategic_dashboard && (
                    <AccordionItem value="strategic_dashboard" className="rounded-md border">
                      <AccordionTrigger className="w-full text-left text-lg font-semibold px-4 py-3">Tableau de bord stratégique</AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-3 border-t">
                        <Accordion
                          className="space-y-3"
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          variants={{ expanded: { opacity: 1, height: 'auto', y: 0 }, collapsed: { opacity: 0, height: 0, y: -6 } }}
                          expandedValue={expandedStrategicSection}
                          onValueChange={setExpandedStrategicSection}
                        >
                          {reportDetails.state.RapportDeSortie.strategic_dashboard.proactive_insights && (
                            <AccordionItem value="proactive_insights" className="rounded border">
                              <AccordionTrigger className="w-full text-left font-medium px-3 py-2">Synthèse proactive</AccordionTrigger>
                              <AccordionContent className="px-3 pb-3 pt-3 border-t">
                                <div className="space-y-4 text-sm">
                                  {((reportDetails.state.RapportDeSortie.strategic_dashboard.proactive_insights.identified_issues?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium">Points identifiés</div>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {reportDetails.state.RapportDeSortie.strategic_dashboard.proactive_insights.identified_issues?.map((i: string, idx: number) => (
                                          <li key={`pi-ii-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {((reportDetails.state.RapportDeSortie.strategic_dashboard.proactive_insights.proposed_solutions?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium">Pistes/solutions</div>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {reportDetails.state.RapportDeSortie.strategic_dashboard.proactive_insights.proposed_solutions?.map((i: string, idx: number) => (
                                          <li key={`pi-ps-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )}

                          {reportDetails.state.RapportDeSortie.strategic_dashboard.action_plan && (
                            <AccordionItem value="action_plan" className="rounded border">
                              <AccordionTrigger className="w-full text-left font-medium px-3 py-2">Plan d’action</AccordionTrigger>
                              <AccordionContent className="px-3 pb-3 pt-3 border-t">
                                <div className="space-y-4 text-sm">
                                  {((reportDetails.state.RapportDeSortie.strategic_dashboard.action_plan.for_tc?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <h4 className="font-medium">Plan d’action – TC</h4>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {reportDetails.state.RapportDeSortie.strategic_dashboard.action_plan.for_tc?.map((i: string, idx: number) => (
                                          <li key={`ap-tc-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {((reportDetails.state.RapportDeSortie.strategic_dashboard.action_plan.for_farmer?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <h4 className="font-medium">Plan d’action – Agriculteur</h4>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {reportDetails.state.RapportDeSortie.strategic_dashboard.action_plan.for_farmer?.map((i: string, idx: number) => (
                                          <li key={`ap-farmer-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )}

                          {reportDetails.state.RapportDeSortie.strategic_dashboard.opportunity_detector && (
                            <AccordionItem value="opportunity_detector" className="rounded border">
                              <AccordionTrigger className="w-full text-left font-medium px-3 py-2">Détecteur d’opportunités</AccordionTrigger>
                              <AccordionContent className="px-3 pb-3 pt-3 border-t">
                                <div className="space-y-4 text-sm">
                                  {((reportDetails.state.RapportDeSortie.strategic_dashboard.opportunity_detector.sales?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <h4 className="font-medium">Opportunités (ventes)</h4>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {reportDetails.state.RapportDeSortie.strategic_dashboard.opportunity_detector.sales?.map((i: string, idx: number) => (
                                          <li key={`od-sales-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {((reportDetails.state.RapportDeSortie.strategic_dashboard.opportunity_detector.advice?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <h4 className="font-medium">Conseils</h4>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {reportDetails.state.RapportDeSortie.strategic_dashboard.opportunity_detector.advice?.map((i: string, idx: number) => (
                                          <li key={`od-adv-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {((reportDetails.state.RapportDeSortie.strategic_dashboard.opportunity_detector.farmer_projects?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <h4 className="font-medium">Projets agriculteur</h4>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {reportDetails.state.RapportDeSortie.strategic_dashboard.opportunity_detector.farmer_projects?.map((i: string, idx: number) => (
                                          <li key={`od-fp-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )}

                          {reportDetails.state.RapportDeSortie.strategic_dashboard.risk_analysis && (
                            <AccordionItem value="risk_analysis" className="rounded border">
                              <AccordionTrigger className="w-full text-left font-medium px-3 py-2">Analyse des risques</AccordionTrigger>
                              <AccordionContent className="px-3 pb-3 pt-3 border-t">
                                <div className="space-y-4 text-sm">
                                  {((reportDetails.state.RapportDeSortie.strategic_dashboard.risk_analysis.commercial?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <h4 className="font-medium">Risque commercial</h4>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {reportDetails.state.RapportDeSortie.strategic_dashboard.risk_analysis.commercial?.map((i: string, idx: number) => (
                                          <li key={`risk-com-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {((reportDetails.state.RapportDeSortie.strategic_dashboard.risk_analysis.technical?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <h4 className="font-medium">Risque technique</h4>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {reportDetails.state.RapportDeSortie.strategic_dashboard.risk_analysis.technical?.map((i: string, idx: number) => (
                                          <li key={`risk-tech-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {((reportDetails.state.RapportDeSortie.strategic_dashboard.risk_analysis.weak_signals?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <h4 className="font-medium">Signaux faibles</h4>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {reportDetails.state.RapportDeSortie.strategic_dashboard.risk_analysis.weak_signals?.map((i: string, idx: number) => (
                                          <li key={`risk-ws-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )}

                          {reportDetails.state.RapportDeSortie.strategic_dashboard.relationship_barometer && (
                            <AccordionItem value="relationship_barometer" className="rounded border">
                              <AccordionTrigger className="w-full text-left font-medium px-3 py-2">Baromètre de la relation</AccordionTrigger>
                              <AccordionContent className="px-3 pb-3 pt-3 border-t">
                                <div className="space-y-4 text-sm">
                                  {((reportDetails.state.RapportDeSortie.strategic_dashboard.relationship_barometer.satisfaction_points?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <h4 className="font-medium">Points de satisfaction</h4>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {reportDetails.state.RapportDeSortie.strategic_dashboard.relationship_barometer.satisfaction_points?.map((i: string, idx: number) => (
                                          <li key={`rel-sat-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {((reportDetails.state.RapportDeSortie.strategic_dashboard.relationship_barometer.frustration_points?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <h4 className="font-medium">Points de frustration</h4>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {reportDetails.state.RapportDeSortie.strategic_dashboard.relationship_barometer.frustration_points?.map((i: string, idx: number) => (
                                          <li key={`rel-frus-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {((reportDetails.state.RapportDeSortie.strategic_dashboard.relationship_barometer.personal_notes?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <h4 className="font-medium">Notes personnelles</h4>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {reportDetails.state.RapportDeSortie.strategic_dashboard.relationship_barometer.personal_notes?.map((i: string, idx: number) => (
                                          <li key={`rel-notes-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )}

                          {reportDetails.state.RapportDeSortie.strategic_dashboard.next_contact_prep && (
                            <AccordionItem value="next_contact_prep" className="rounded border">
                              <AccordionTrigger className="w-full text-left font-medium px-3 py-2">Préparation du prochain contact</AccordionTrigger>
                              <AccordionContent className="px-3 pb-3 pt-3 border-t">
                                <div className="space-y-4 text-sm">
                                  {(typeof reportDetails.state.RapportDeSortie.strategic_dashboard.next_contact_prep.opening_topic === 'string' && reportDetails.state.RapportDeSortie.strategic_dashboard.next_contact_prep.opening_topic.trim() !== '') && (
                                    <div className="space-y-1">
                                      <h4 className="font-medium">Sujet d’ouverture</h4>
                                      <p className="text-sm whitespace-pre-wrap">{reportDetails.state.RapportDeSortie.strategic_dashboard.next_contact_prep.opening_topic}</p>
                                    </div>
                                  )}
                                  {(typeof reportDetails.state.RapportDeSortie.strategic_dashboard.next_contact_prep.next_visit_objective === 'string' && reportDetails.state.RapportDeSortie.strategic_dashboard.next_contact_prep.next_visit_objective.trim() !== '') && (
                                    <div className="space-y-1">
                                      <h4 className="font-medium">Objectif de la prochaine visite</h4>
                                      <p className="text-sm whitespace-pre-wrap">{reportDetails.state.RapportDeSortie.strategic_dashboard.next_contact_prep.next_visit_objective}</p>
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )}
                        </Accordion>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center justify-center gap-6">
          <p className="text-sm text-muted-foreground text-center max-w-xl">
            Aucun rapport n’est disponible pour cette session. Si votre visite est terminée, vous pouvez la finaliser. Sinon, lancez un appel pour continuer en temps réel.
          </p>
                  <Button
            size="lg"
            className="h-12 px-6 rounded-full text-base"
                    onClick={async () => {
              setSessionStarted(true);
                      setUiState(prev => ({ ...prev, isConnecting: true }));
                      pendingConnectedSoundRef.current = true;
                      connectedSoundPlayedRef.current = false;
                      try {
                        if (!backendBase) {
                          setUiState(prev => ({ ...prev, isConnecting: false }));
                  setSessionStarted(false);
                          addLog(LogLevel.Error, 'Missing NEXT_PUBLIC_BACKEND_BASE_URL');
                          return;
                        }
                        await safeManualConnect();
                      } catch (err) {
                        setUiState(prev => ({ ...prev, isConnecting: false }));
                setSessionStarted(false);
                        addLog(LogLevel.Error, 'Failed to connect', err);
                      }
                    }}
                  >
            <TelephoneSolid className="mr-2" />
            {uiState.isConnecting ? 'Connexion…' : 'Démarrer l’appel'}
                  </Button>
        </div>
      )}

      {sessionStarted && !hasReport && (
        <CallScreen
          inCall={wsStatus === WsStatus.Connected && uiState.serverReady}
          isConnecting={uiState.isConnecting || wsStatus === WsStatus.Connecting}
          isDisconnecting={uiState.isDisconnecting}
          isStreamingOn={uiState.isOnline && wsStatus === WsStatus.Connected && uiState.serverReady && uiState.isMicHwOn && uiState.isStreamingOn && uiState.serverAlive && !isToolCallActive}
          disableStreaming={!uiState.isOnline || wsStatus !== WsStatus.Connected || !uiState.serverReady || !uiState.isMicHwOn}
          level01={lastLevelRef.current}
          onDisconnect={async () => {
                      setUiState(prev => ({ ...prev, isDisconnecting: true }));
                      try { sendMessageRef.current({ event: 'client_disconnect', intent: 'manual' }); } catch {}
                      sessionReconnection.manualDisconnect();
            setSessionStarted(false);
            pendingConnectedSoundRef.current = false;
            connectedSoundPlayedRef.current = false;
          }}
          onToggleStreaming={(next) => {
            setUiState(prev => ({ ...prev, isStreamingOn: next }));
            sessionMode.resetToIdle();
          }}
          isMicHwOn={uiState.isMicHwOn}
          onToggleMicHardware={async (next) => {
            try {
              if (next) {
                // Only allow mic hardware ON if WS is connected & server ready
                if (wsStatusRef.current === WsStatus.Connected && serverReadyRef.current) {
                  await startMic();
                  setUiState(prev => ({ ...prev, isMicHwOn: true, isStreamingOn: true }));
                } else {
                  addLog(LogLevel.Ws, 'Cannot enable microphone - WS not ready');
                  setUiState(prev => ({ ...prev, isMicHwOn: false, isStreamingOn: false }));
                }
              } else {
                stopMic();
                setUiState(prev => ({ ...prev, isMicHwOn: false, isStreamingOn: false }));
              }
            } catch {}
          }}
        />
      )}
    </div>
  );
}

