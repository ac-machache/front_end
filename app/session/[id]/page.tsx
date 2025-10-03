"use client";
import React, { useCallback, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import CallScreen from '@/components/agent/CallScreen';
import ReportDisplay from '@/components/agent/ReportDisplay';
import type { Config, HeartbeatEvent } from '@/lib/types';
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
  useUiState,
  useSessionReport,
  useLogger,
  AUDIO_CONSTANTS
} from '@/lib/hooks';
import { useSearchParams } from 'next/navigation';
import { TelephoneSolid, PanelRightOpenSolid, BookmarkSolid } from '@mynaui/icons-react';
import { routeWsMessage } from '@/lib/wsRouter';
import { buildWebSocketUrl } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthProvider';
import { getClientById, updateClientSessionDoc } from '@/lib/firebase';
import { Spinner } from '@/components/ui/shadcn-io/spinner';

export default function SessionDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientIdParam = searchParams?.get('clientId') || '';
  const { user } = useAuth();
  const [config, setConfig] = useLocalStorage<Config>('app-config', { scheme: 'wss', host: 'localhost', port: '443', appName: 'app', userId: 'user', sessionId: '' });

  const { state: uiState, dispatch } = useUiState();
  const { reportDetails, reportLoading, refetch: refetchReport } = useSessionReport(params.id!, clientIdParam, user);
  const [clientMeta, setClientMeta] = React.useState<{ city?: string; zipCode?: string } | null>(null);
  const generatingOverlayRef = React.useRef<HTMLDivElement | null>(null);

  const lastHeartbeatAtRef = useRef<number>(Date.now());
  const lastWsMessageAtRef = useRef<number>(Date.now());
  const micHwBeforeHideRef = useRef<boolean>(false);
  const streamingBeforeHideRef = useRef<boolean>(false);

  // Create refs to avoid TDZ issues
  const connectRef = React.useRef<() => void>(() => {});
  const disconnectRef = React.useRef<() => void>(() => {});

  // Initialize hooks
  const { addLog } = useLogger();

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
    const canSend = uiState.isOnline && serverReadyRef.current && uiState.serverAlive && isMicOnRef.current && !uiState.isThinking && wsStatusRef.current === WsStatus.Connected;
    if (canSend) {
      sendMessageRef.current({ mime_type: 'audio/pcm', data: base64 });
    }
  }, [uiState.isOnline, uiState.serverAlive, uiState.isThinking]);
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
      dispatch({ type: 'SET_SERVER_READY', payload: false });
      dispatch({ type: 'SET_SERVER_ALIVE', payload: true });
      lastHeartbeatAtRef.current = Date.now();
      addLog(LogLevel.Ws, 'Reset server liveness on reconnection');
    };
  }, [addLog, sessionMode, dispatch]);

  React.useEffect(() => {
    const handleOnline = () => {
      dispatch({ type: 'SET_IS_ONLINE', payload: true });
      addLog(LogLevel.Ws, 'Browser online', { online: true, visibility: typeof document !== 'undefined' ? document.visibilityState : undefined });
    };
    const handleOffline = () => {
        dispatch({ type: 'SET_IS_ONLINE', payload: false });
      addLog(LogLevel.Ws, 'Browser offline', { online: false, visibility: typeof document !== 'undefined' ? document.visibilityState : undefined });
      disconnectRef.current();
      audioPlayback.cleanup();
      sessionMode.setDisconnected();
      // Reset local flags
      setStreamingEnabled(false);
      dispatch({ type: 'RESET_CALL_STATE' });
      pendingConnectedSoundRef.current = true;
      connectedSoundPlayedRef.current = false;
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addLog, disconnectRef, audioPlayback, sessionMode, setStreamingEnabled, dispatch]);


  // --- WebSocket Message Handlers ---
  const handleReady = useCallback(() => {
    addLog(LogLevel.Event, 'Server ready - audio can now be sent', {
      micOn: isMicOnRef.current,
      toolCallActive: audioPlayback.isToolCallActive(),
      wsStatus: wsStatusRef.current
    });
    serverReadyRef.current = true;
    dispatch({ type: 'SET_SERVER_READY', payload: true });
  }, [addLog, audioPlayback, dispatch]);


  const handleSpeechControl = useCallback((event: 'speech_start' | 'speech_end') => {
    if (event === 'speech_start') {
        dispatch({ type: 'SET_LISTENING', payload: true });
      clearPlaybackQueue();
    } else {
        dispatch({ type: 'SET_LISTENING', payload: false });
    }
  }, [clearPlaybackQueue, dispatch]);

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
    if (!uiState.serverAlive) dispatch({ type: 'SET_SERVER_ALIVE', payload: true });
    addLog(LogLevel.Event, 'Heartbeat received and responded', {
      server_timestamp: msg.timestamp,
      data: msg.data
    });
  }, [addLog, uiState.serverAlive, dispatch]);

  const handleFunctionCall = useCallback(() => {
    sessionMode.startThinking();
    addLog(LogLevel.Audio, 'Disabling streaming');
    dispatch({ type: 'SET_TOOL_CALL_ACTIVE', payload: true });
    audioPlayback.startToolCall();
  }, [addLog, audioPlayback, sessionMode, dispatch]);

  const handleFunctionResponse = useCallback(() => {
    audioPlayback.endToolCall();
    dispatch({ type: 'SET_TOOL_CALL_ACTIVE', payload: false });
    sessionMode.stopThinking();
  }, [audioPlayback, sessionMode, dispatch]);
  
  const handleTurnControl = useCallback((msg: { turn_complete?: unknown; interrupted?: unknown; [k: string]: unknown }) => {
    addLog(LogLevel.Event, 'Turn Control', msg);
    if (msg?.interrupted) {
      clearPlaybackQueue();
    }
    audioPlayback.endToolCall();
    dispatch({ type: 'SET_TOOL_CALL_ACTIVE', payload: false });
    sessionMode.stopThinking();
  }, [addLog, audioPlayback, clearPlaybackQueue, sessionMode, dispatch]);

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
      isToolCallActive: uiState.isThinking,
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
    dispatch({ type: 'RESET_CALL_STATE' });
    sessionMode.resetToIdle();
    clearPlaybackQueue();
    // Prepare next connect sound and close overlay
    pendingConnectedSoundRef.current = true;
    connectedSoundPlayedRef.current = false;
  }, [addLog, stopMic, audioPlayback, setStreamingEnabled, sessionMode, clearPlaybackQueue, uiState.serverAlive, uiState.isThinking, wsUrl, dispatch]);

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
      if (since > AUDIO_CONSTANTS.HEARTBEAT_TIMEOUT_MS && uiState.serverAlive) dispatch({ type: 'SET_SERVER_ALIVE', payload: false });
    }, 5000);
    return () => { try { window.clearInterval(t); } catch {} };
  }, [uiState.serverAlive, dispatch]);

  React.useEffect(() => {
    const shouldEnable = !!(uiState.isOnline && wsStatus === WsStatus.Connected && uiState.serverReady && uiState.isMicHwOn && uiState.isStreamingOn && uiState.serverAlive && !uiState.isThinking);
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
        toolCallActive: uiState.isThinking
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
  }, [uiState.isOnline, wsStatus, uiState.serverReady, uiState.isMicHwOn, uiState.isStreamingOn, uiState.serverAlive, uiState.isThinking, setStreamingEnabled, addLog, audioPlayback]);

  useWakeLock(addLog, uiState.isCallScreen && wsStatus === WsStatus.Connected);

  useVisibilityGuard(addLog, {
    pause: async () => {
      micHwBeforeHideRef.current = !!uiState.isMicHwOn;
      streamingBeforeHideRef.current = !!uiState.isStreamingOn;
      setStreamingEnabled(false);
      try { stopMic(); } catch {}
      dispatch({ type: 'SET_MIC_HW_ON', payload: false });
      dispatch({ type: 'SET_STREAMING_ON', payload: false });
      addLog(LogLevel.Ws, 'Page hidden - paused mic and streaming');
    },
    restore: async () => {
      addLog(LogLevel.Ws, 'Page visible - attempting restore');
      if (micHwBeforeHideRef.current && wsStatusRef.current === WsStatus.Connected && serverReadyRef.current) {
        try { await startMic(); dispatch({ type: 'SET_MIC_HW_ON', payload: true }); } catch {}
      }
      if (streamingBeforeHideRef.current) {
        dispatch({ type: 'SET_STREAMING_ON', payload: true });
      }
    },
    disconnect: async () => {
      try { sendMessageRef.current({ event: 'client_disconnect', intent: 'hidden_timeout' }); } catch {}
      disconnectRef.current();
      pendingConnectedSoundRef.current = true;
      connectedSoundPlayedRef.current = false;
      dispatch({ type: 'RESET_CALL_STATE' });
      addLog(LogLevel.Ws, 'Hidden grace expired - disconnected');
    },
    graceMs: AUDIO_CONSTANTS.VISIBILITY_GRACE_MS
  });

  React.useEffect(() => {
    const fetchClientMeta = async () => {
      if (!user?.uid || !clientIdParam) return;
      try {
        const clientDoc = await getClientById(user.uid, clientIdParam);
        if (clientDoc) {
          setClientMeta({
            city: typeof clientDoc.city === 'string' ? clientDoc.city : undefined,
            zipCode: typeof clientDoc.zipCode === 'string' ? clientDoc.zipCode : undefined,
          });
        }
      } catch (err) {
        addLog(LogLevel.Error, 'Failed to load client metadata', err);
      }
    };
    fetchClientMeta();
  }, [user?.uid, clientIdParam, addLog]);

  // Reset to idle when mic state changes
  React.useEffect(() => {
    sessionMode.resetToIdle();
  }, [uiState.isStreamingOn, sessionMode]);

  React.useEffect(() => {
    if (wsStatus !== WsStatus.Connecting) dispatch({ type: 'SET_IS_CONNECTING', payload: false });
    if (wsStatus === WsStatus.Disconnected) dispatch({ type: 'SET_IS_DISCONNECTING', payload: false });
  }, [wsStatus, dispatch]);

  const reportContent = reportDetails?.state?.RapportDeSortie;
  const hasReport = !!reportContent && Object.keys(reportContent as Record<string, unknown>).length > 0;

  const notifyReportReady = useCallback(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    const openReport = () => {
      const targetUrl = `${window.location.origin}/session/${params.id}?clientId=${clientIdParam}`;
      window.focus();
      if (window.location.href !== targetUrl) {
        window.location.href = targetUrl;
      }
    };
    const createNotification = () => {
      const notification = new Notification('Rapport généré', {
        body: "Cliquez pour consulter le rapport finalisé.",
        tag: `report-${params.id}`,
      });
      notification.onclick = () => {
        openReport();
        notification.close();
      };
    };
    if (Notification.permission === 'granted') {
      createNotification();
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') createNotification();
      }).catch(() => {});
    }
  }, [clientIdParam, params.id]);

  const triggerReportGeneration = React.useCallback(async () => {
    if (!params.id || !user?.uid || !clientIdParam) return;
    dispatch({ type: 'SET_IS_GENERATING_REPORT', payload: true });
    
    // Mark session as generating in localStorage
    const generatingKey = `generating-report-${params.id}`;
    localStorage.setItem(generatingKey, 'true');
    
    // Redirect to sessions page immediately
    router.replace(clientIdParam ? `/session?clientId=${clientIdParam}` : '/session');
    
    try {
      const response = await apiClient.generateReport(params.id as string, {
        ville: clientMeta?.city ?? null,
        zip_code: clientMeta?.zipCode ?? null,
        current_document_path: `technico/${user.uid}/clients/${clientIdParam}/sessions/${params.id}`,
      });

      if (response.ok && (response.value as { result?: unknown })?.result) {
        const structured = (response.value as { result: unknown }).result as Record<string, unknown>;
        if (!structured || typeof structured !== 'object' || !('main_report' in structured) || !('strategic_dashboard' in structured)) {
          console.warn('Report payload missing expected keys.', structured);
        } else {
          await updateClientSessionDoc(user.uid, clientIdParam, params.id as string, {
            ReportKey: structured,
            is_report_done: true,
          });
          await refetchReport();
          notifyReportReady();
        }
      } else {
        console.warn('Report generation completed without usable result.', response);
      }
    } catch (err) {
      addLog(LogLevel.Error, 'Failed to request report generation', err);
    } finally {
      // Remove from localStorage when done
      localStorage.removeItem(generatingKey);
      dispatch({ type: 'SET_IS_GENERATING_REPORT', payload: false });
    }
  }, [apiClient, params.id, clientMeta?.city, clientMeta?.zipCode, user?.uid, clientIdParam, addLog, dispatch, refetchReport, notifyReportReady, router]);

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

      {reportLoading ? (
        <div className="text-sm text-muted-foreground">Chargement…</div>
        ) : hasReport ? (
        <ReportDisplay reportDetails={reportDetails} reportLoading={reportLoading} />
      ) : (
        <div className="relative mt-10 flex flex-col items-center justify-center gap-6 min-h-[220px]">
          {uiState.isGeneratingReport && (
            <div ref={generatingOverlayRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-[32px] bg-background/80 backdrop-blur-md">
              <Spinner variant="ellipsis" className="text-white" size={48} />
              <span className="text-sm text-muted-foreground">Génération du rapport…</span>
            </div>
          )}
          <p className={`text-sm text-muted-foreground text-center max-w-xl transition-opacity ${uiState.isGeneratingReport ? 'opacity-40' : 'opacity-100'}`}>
            Aucun rapport n’est disponible pour cette session. Si votre visite est terminée, vous pouvez la finaliser. Sinon, lancez un appel pour continuer en temps réel.
          </p>
          <div className={`flex flex-col items-center gap-3 transition-opacity ${uiState.isGeneratingReport ? 'opacity-40' : 'opacity-100'}`} aria-hidden={uiState.isGeneratingReport}>
            <Button
              size="lg"
              className="inline-flex items-center justify-center h-12 px-6 gap-2 rounded-full text-base"
              onClick={() => {
                dispatch({ type: 'SHOW_CALL_SCREEN' });
                pendingConnectedSoundRef.current = true;
                connectedSoundPlayedRef.current = false;
                safeManualConnect();
              }}
            >
              <TelephoneSolid />
              <span>{uiState.isConnecting ? 'Connexion…' : 'Démarrer l’appel'}</span>
            </Button>
            <Button
              size="lg"
              className="relative inline-flex items-center justify-center h-12 px-6 gap-2 rounded-full text-base"
              disabled={uiState.isGeneratingReport}
              onClick={triggerReportGeneration}
            >
              {uiState.isGeneratingReport && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Spinner variant="ellipsis" className="text-white" />
                </span>
              )}
              <span className={uiState.isGeneratingReport ? 'opacity-0' : 'inline-flex items-center gap-2'}>
                <BookmarkSolid />
                <span>Finaliser la visite</span>
              </span>
            </Button>
          </div>
        </div>
      )}

      {uiState.isCallScreen && !hasReport && (
        <CallScreen
          inCall={wsStatus === WsStatus.Connected && !!uiState.serverReady}
          isConnecting={uiState.isConnecting || wsStatus === WsStatus.Connecting}
          isDisconnecting={uiState.isDisconnecting}
          isStreamingOn={!!(uiState.isOnline && wsStatus === WsStatus.Connected && uiState.serverReady && uiState.isMicHwOn && uiState.isStreamingOn && uiState.serverAlive && !uiState.isThinking)}
          disableStreaming={!uiState.isOnline || wsStatus !== WsStatus.Connected || !uiState.serverReady || !uiState.isMicHwOn}
          level01={lastLevelRef.current}
          onDisconnect={async () => {
            dispatch({ type: 'SET_IS_DISCONNECTING', payload: true });
            // Immediately stop mic and disable streaming to avoid any residual buffers
            try { setStreamingEnabled(false); } catch {}
            try { stopMic(); } catch {}
            try { clearPlaybackQueue(); } catch {}
            try { sendMessageRef.current({ event: 'client_disconnect', intent: 'manual' }); } catch {}
            disconnectRef.current();
            dispatch({ type: 'RESET_CALL_STATE' });
            pendingConnectedSoundRef.current = false;
            connectedSoundPlayedRef.current = false;
          }}
          onToggleStreaming={(next) => {
            dispatch({ type: 'SET_STREAMING_ON', payload: next });
            sessionMode.resetToIdle();
          }}
          isMicHwOn={uiState.isMicHwOn}
          onToggleMicHardware={async (next) => {
            try {
              if (next) {
                // Only allow mic hardware ON if WS is connected & server ready
                if (wsStatusRef.current === WsStatus.Connected && serverReadyRef.current) {
                  await startMic();
                  dispatch({ type: 'SET_MIC_HW_ON', payload: true });
                  dispatch({ type: 'SET_STREAMING_ON', payload: true });
                } else {
                  addLog(LogLevel.Ws, 'Cannot enable microphone - WS not ready');
                  dispatch({ type: 'SET_MIC_HW_ON', payload: false });
                  dispatch({ type: 'SET_STREAMING_ON', payload: false });
                }
              } else {
                stopMic();
                dispatch({ type: 'SET_MIC_HW_ON', payload: false });
                dispatch({ type: 'SET_STREAMING_ON', payload: false });
              }
            } catch {}
          }}
        />
      )}
    </div>
  );
}