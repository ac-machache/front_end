"use client";
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CallScreen from '@/components/agent/CallScreen';
import type { Config, HeartbeatEvent, SessionDetails } from '@/lib/types';
import { LogLevel, WsStatus } from '@/lib/types';
import {
  useLocalStorage,
  useWebSocket,
  useAudioProcessor,
  useAudioPlayback,
  useSessionMode,
  useApiClient,
  useVisibilityGuard,
  useWakeLock,
  AUDIO_CONSTANTS
} from '@/lib/hooks';
import { useSearchParams } from 'next/navigation';
import { TelephoneSolid } from '@mynaui/icons-react';
import { PanelRightOpenSolid } from '@mynaui/icons-react';
import { routeWsMessage } from '@/lib/wsRouter';
import { buildWebSocketUrl } from '@/lib/utils';
import { getClientSessionDoc } from '@/lib/firebase';
import { useAuth } from '@/components/auth/AuthProvider';

export default function SessionDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientIdParam = searchParams?.get('clientId') || '';
  const { user } = useAuth();
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

  const lastHeartbeatAtRef = useRef<number>(Date.now());
  const lastWsMessageAtRef = useRef<number>(Date.now());
  const micHwBeforeHideRef = useRef<boolean>(false);
  const streamingBeforeHideRef = useRef<boolean>(false);

  // Create refs to avoid TDZ issues
  const connectRef = React.useRef<() => void>(() => {});
  const disconnectRef = React.useRef<() => void>(() => {});

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

  // Fetch report (once) for this session id: prefer Firestore ReportKey for speed, fallback to backend
  React.useEffect(() => {
    const id = params?.id as string;
    if (!id || !clientIdParam) { setReportDetails(null); return; }
    setReportLoading(true);
    (async () => {
      try {
        // Prefer Firestore ReportKey if present (requires user.uid)
        if (user?.uid) {
          const fsDoc = await getClientSessionDoc(user.uid, clientIdParam, id);
          const reportKey = (fsDoc as unknown as { ReportKey?: unknown; nom_tc?: string; nom_agri?: string })?.ReportKey;
          if (reportKey) {
            setReportDetails({ id, state: { RapportDeSortie: reportKey, nom_tc: (fsDoc as { nom_tc?: string }).nom_tc, nom_agri: (fsDoc as { nom_agri?: string }).nom_agri } } as SessionDetails);
            return;
          }
        }
        // Fallback to backend
        const details = await apiClient.getSession(id) as SessionDetails | null;
        setReportDetails(details);
      } finally {
        setReportLoading(false);
      }
    })().catch(() => setReportLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id, clientIdParam, user?.uid]);


  const wsUrl = useMemo(() => buildWebSocketUrl(params.id!, clientIdParam), [params.id, clientIdParam]);

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
  const { startMic, stopMic, playAudioChunk, clearPlaybackQueue, setStreamingEnabled } = useAudioProcessor(
    onMicData,
    addLog,
    (lvl) => { lastLevelRef.current = lvl; },
    () => { try { audioPlayback.endModelAudio(); } catch {} }
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
      disconnectRef.current();
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
  }, [addLog, disconnectRef, audioPlayback, sessionMode, setStreamingEnabled]);


  // --- WebSocket Message Handlers ---
  const handleReady = useCallback(() => {
    addLog(LogLevel.Event, 'Server ready - audio can now be sent', {
      micOn: isMicOnRef.current,
      toolCallActive: audioPlayback.isToolCallActive(),
      wsStatus: wsStatusRef.current
    });
    serverReadyRef.current = true;
    setUiState(prev => ({ ...prev, serverReady: true }));
  }, [addLog, audioPlayback]);


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
      audioPlayback.keepModelAudioAlive(500);
      for (const f of frames) {
        if (f?.mime_type?.startsWith('audio/')) {
          playAudioChunk(f.data);
        }
      }
      sessionMode.startResponding(2500);
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
      audioPlayback.keepModelAudioAlive(500);
      playAudioChunk(msg.data as string);
      sessionMode.startResponding(2500);
      addLog(LogLevel.Audio, 'Played audio_data chunk', { len });
    }
  }, [addLog, audioPlayback, playAudioChunk, sessionMode, uiState.isStreamingOn]);

  const onWsMessage = useCallback((data: unknown) => {
    lastWsMessageAtRef.current = Date.now();
    routeWsMessage(data, {
      ready: handleReady,
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
  }, [addLog, handleReady, handleSpeechControl, handleAudioBuffer, handleHeartbeat, handleFunctionCall, handleFunctionResponse, clearPlaybackQueue, handleTurnControl, handleAudioData]);

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
    // Prepare next connect sound and close overlay
    pendingConnectedSoundRef.current = true;
    connectedSoundPlayedRef.current = false;
    setSessionStarted(false);
  }, [addLog, stopMic, audioPlayback, setStreamingEnabled, sessionMode, clearPlaybackQueue, uiState.serverAlive, isToolCallActive, wsUrl]);

  const onWsError = useCallback((event?: Event) => addLog(LogLevel.Error, 'WebSocket error', event), [addLog]);
  const { connect, disconnect, sendMessage, status: wsStatus } = useWebSocket(wsUrl, () => onWsOpenRef.current(), onWsMessage, onWsClose, onWsError);

  // Update refs after WebSocket hook initialization
  React.useEffect(() => { connectRef.current = connect; disconnectRef.current = disconnect; }, [connect, disconnect]);
  React.useEffect(() => { wsStatusRef.current = wsStatus; }, [wsStatus]);

  React.useEffect(() => {
    sendMessageRef.current = (data: unknown) => sendMessage(data);
  }, [sendMessage]);

  // Ensure a clean slate before manualConnect: if an old connecting socket lingers, replace it
  const safeManualConnect = React.useCallback(async () => {
    try {
      connectRef.current();
    } catch (e) {
      addLog(LogLevel.Error, 'safeManualConnect failed', e);
      throw e;
    }
  }, [connectRef, addLog]);

  React.useEffect(() => {
    const t = window.setInterval(() => {
      const since = Date.now() - lastHeartbeatAtRef.current;
      if (since > AUDIO_CONSTANTS.HEARTBEAT_TIMEOUT_MS && uiState.serverAlive) setUiState(prev => ({ ...prev, serverAlive: false }));
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
    const prev = (React as unknown as { __prevShouldEnable?: { current?: boolean } }).__prevShouldEnable;
    if (!prev || typeof prev.current !== 'boolean') { (React as unknown as { __prevShouldEnable?: { current?: boolean } }).__prevShouldEnable = { current: shouldEnable }; }
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
      disconnectRef.current();
      pendingConnectedSoundRef.current = true;
      connectedSoundPlayedRef.current = false;
      setSessionStarted(false);
      addLog(LogLevel.Ws, 'Hidden grace expired - disconnected');
    },
    graceMs: AUDIO_CONSTANTS.VISIBILITY_GRACE_MS
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
                <div className="space-y-6 text-sm leading-relaxed">
                  {(() => {
                    const rpt = reportDetails.state.RapportDeSortie;
                    const main = rpt.main_report;
                    const sd = rpt.strategic_dashboard;
                    return (
                      <>
                        <section className="space-y-3">
                          <h3 className="text-lg font-semibold">Rapport principal</h3>
                          <div className="rounded-lg border p-4">
                            <dl className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-x-6 gap-y-3 items-start">
                              {(typeof main?.title === 'string' && main.title.trim() !== '') && (
                                <>
                                  <dt className="text-xs md:text-[13px] uppercase tracking-wide text-muted-foreground">Titre</dt>
                                  <dd className="text-sm font-medium">{main.title}</dd>
                                </>
                              )}
                              {(typeof main?.date_of_visit === 'string' && main.date_of_visit.trim() !== '') && (
                                <>
                                  <dt className="text-xs md:text-[13px] uppercase tracking-wide text-muted-foreground">Date</dt>
                                  <dd className="text-sm">{main.date_of_visit}</dd>
                                </>
                              )}
                              {(typeof main?.farmer === 'string' && main.farmer.trim() !== '') && (
                                <>
                                  <dt className="text-xs md:text-[13px] uppercase tracking-wide text-muted-foreground">Agriculteur</dt>
                                  <dd className="text-sm">{main.farmer}</dd>
                                </>
                              )}
                              {(typeof main?.tc === 'string' && main.tc.trim() !== '') && (
                                <>
                                  <dt className="text-xs md:text-[13px] uppercase tracking-wide text-muted-foreground">TC</dt>
                                  <dd className="text-sm">{main.tc}</dd>
                                </>
                              )}
                            </dl>
                            {(typeof main?.report_summary === 'string' && main.report_summary.trim() !== '') && (
                              <div className="mt-4 pt-4 border-t">
                                <div className="text-sm font-medium mb-1">Résumé</div>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">{main.report_summary}</p>
                              </div>
                            )}
                          </div>
                        </section>

                        {sd && (
                          <>
                            <h3 className="text-lg font-semibold">Tableau de bord stratégique</h3>
                            <div className="space-y-4">
                              {sd.proactive_insights && (
                                <section className="space-y-2 rounded-lg border p-4">
                                  <h4 className="font-semibold">Synthèse proactive</h4>
                                  {((sd.proactive_insights.identified_issues?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium">Points identifiés</div>
                                      <ul className="list-disc pl-5 md:pl-6 space-y-1">
                                        {sd.proactive_insights.identified_issues?.map((i: string, idx: number) => (
                                          <li key={`pi-ii-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {((sd.proactive_insights.proposed_solutions?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium">Pistes/solutions</div>
                                      <ul className="list-disc pl-5 md:pl-6 space-y-1">
                                        {sd.proactive_insights.proposed_solutions?.map((i: string, idx: number) => (
                                          <li key={`pi-ps-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </section>
                              )}

                              {sd.action_plan && (
                                <section className="space-y-2 rounded-lg border p-4">
                                  <h4 className="font-semibold">Plan d’action</h4>
                                  {((sd.action_plan.for_tc?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium">Plan d’action – TC</div>
                                      <ul className="list-disc pl-5 md:pl-6 space-y-1">
                                        {sd.action_plan.for_tc?.map((i: string, idx: number) => (
                                          <li key={`ap-tc-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {((sd.action_plan.for_farmer?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium">Plan d’action – Agriculteur</div>
                                      <ul className="list-disc pl-5 md:pl-6 space-y-1">
                                        {sd.action_plan.for_farmer?.map((i: string, idx: number) => (
                                          <li key={`ap-farmer-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </section>
                              )}

                              {sd.opportunity_detector && (
                                <section className="space-y-2 rounded-lg border p-4">
                                  <h4 className="font-semibold">Détecteur d’opportunités</h4>
                                  {((sd.opportunity_detector.sales?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium">Opportunités (ventes)</div>
                                      <ul className="list-disc pl-5 md:pl-6 space-y-1">
                                        {sd.opportunity_detector.sales?.map((i: string, idx: number) => (
                                          <li key={`od-sales-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {((sd.opportunity_detector.advice?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium">Conseils</div>
                                      <ul className="list-disc pl-5 md:pl-6 space-y-1">
                                        {sd.opportunity_detector.advice?.map((i: string, idx: number) => (
                                          <li key={`od-adv-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {((sd.opportunity_detector.farmer_projects?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium">Projets agriculteur</div>
                                      <ul className="list-disc pl-5 md:pl-6 space-y-1">
                                        {sd.opportunity_detector.farmer_projects?.map((i: string, idx: number) => (
                                          <li key={`od-fp-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </section>
                              )}

                              {sd.risk_analysis && (
                                <section className="space-y-2 rounded-lg border p-4">
                                  <h4 className="font-semibold">Analyse des risques</h4>
                                  {((sd.risk_analysis.commercial?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium">Risque commercial</div>
                                      <ul className="list-disc pl-5 md:pl-6 space-y-1">
                                        {sd.risk_analysis.commercial?.map((i: string, idx: number) => (
                                          <li key={`risk-com-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {((sd.risk_analysis.technical?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium">Risque technique</div>
                                      <ul className="list-disc pl-5 md:pl-6 space-y-1">
                                        {sd.risk_analysis.technical?.map((i: string, idx: number) => (
                                          <li key={`risk-tech-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {((sd.risk_analysis.weak_signals?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium">Signaux faibles</div>
                                      <ul className="list-disc pl-5 md:pl-6 space-y-1">
                                        {sd.risk_analysis.weak_signals?.map((i: string, idx: number) => (
                                          <li key={`risk-ws-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </section>
                              )}

                              {sd.relationship_barometer && (
                                <section className="space-y-2 rounded-lg border p-4">
                                  <h4 className="font-semibold">Baromètre de la relation</h4>
                                  {((sd.relationship_barometer.satisfaction_points?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium">Points de satisfaction</div>
                                      <ul className="list-disc pl-5 md:pl-6 space-y-1">
                                        {sd.relationship_barometer.satisfaction_points?.map((i: string, idx: number) => (
                                          <li key={`rel-sat-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {((sd.relationship_barometer.frustration_points?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium">Points de frustration</div>
                                      <ul className="list-disc pl-5 md:pl-6 space-y-1">
                                        {sd.relationship_barometer.frustration_points?.map((i: string, idx: number) => (
                                          <li key={`rel-frus-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {((sd.relationship_barometer.personal_notes?.length ?? 0) > 0) && (
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium">Notes personnelles</div>
                                      <ul className="list-disc pl-5 md:pl-6 space-y-1">
                                        {sd.relationship_barometer.personal_notes?.map((i: string, idx: number) => (
                                          <li key={`rel-notes-${idx}`}>{i}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </section>
                              )}

                              {sd.next_contact_prep && (
                                <section className="space-y-2 rounded-lg border p-4">
                                  <h4 className="font-semibold">Préparation du prochain contact</h4>
                                  {(typeof sd.next_contact_prep.opening_topic === 'string' && sd.next_contact_prep.opening_topic.trim() !== '') && (
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium">Sujet d’ouverture</div>
                                      <p className="text-sm whitespace-pre-wrap">{sd.next_contact_prep.opening_topic}</p>
                                    </div>
                                  )}
                                  {(typeof sd.next_contact_prep.next_visit_objective === 'string' && sd.next_contact_prep.next_visit_objective.trim() !== '') && (
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium">Objectif de la prochaine visite</div>
                                      <p className="text-sm whitespace-pre-wrap">{sd.next_contact_prep.next_visit_objective}</p>
                                    </div>
                                  )}
                                </section>
                              )}
                            </div>
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>
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
                        await safeManualConnect();
                        // After WS is up and server ready, the mic button controls hardware.
                        // We keep streamingOff until user toggles the Ear, avoiding premature gating.
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
            // Immediately stop mic and disable streaming to avoid any residual buffers
            try { setStreamingEnabled(false); } catch {}
            try { stopMic(); } catch {}
            try { clearPlaybackQueue(); } catch {}
                      try { sendMessageRef.current({ event: 'client_disconnect', intent: 'manual' }); } catch {}
                      disconnectRef.current();
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

