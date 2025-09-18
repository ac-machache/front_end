"use client";
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import IAdvisor, { type IAdvisorMode } from '@/components/kokonutui/IAdvisor';
import type { Config, HeartbeatEvent, SessionResumedEvent } from '@/lib/types';
import { LogLevel, WsStatus } from '@/lib/types';
import {
  useLocalStorage,
  useWebSocket,
  useAudioProcessor,
  useAudioPlayback,
  useSessionReconnection,
  useSessionMode
} from '@/lib/hooks';
import { useSearchParams } from 'next/navigation';

export default function SessionDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientIdParam = searchParams?.get('clientId') || '';
  const [config, setConfig] = useLocalStorage<Config>('app-config', { scheme: 'wss', host: 'localhost', port: '443', appName: 'app', userId: 'user', sessionId: '' });

  // Consolidated UI and connection state
  const [uiState, setUiState] = useState({
    isMicOn: false,
    isConnecting: false,
    isDisconnecting: false,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    serverAlive: true,
    isListening: false,
    serverReady: false,
  });

  // Track tool-call activity as the single source of truth for gating
  const [isToolCallActive, setIsToolCallActive] = useState<boolean>(false);

  const lastHeartbeatAtRef = useRef<number>(Date.now());
  const lastWsMessageAtRef = useRef<number>(Date.now());

  // Initialize hooks
  const addLog = useCallback((level: LogLevel, message: string, data?: unknown) => {
    // Log to console for debugging - could implement UI logging later if needed
    console.log(`[${level}] ${message}`, data);
  }, []);

  // Audio playback management
  const audioPlayback = useAudioPlayback(addLog);

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

  // Backend base detection (safe)
  const backendBase: string = useMemo(() => {
    try {
      // Next replaces process.env at build time (may be undefined at runtime)
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
    // First load: do not set resume=true
    return `${proto}://${host}/apps/${cfg.appName}/users/${cfg.userId}/sessions/${cfg.sessionId}/ws?${params.toString()}`;
  }, []);

  const wsUrl = useMemo(() => buildWsUrlSafe(config, backendBase), [config, backendBase, buildWsUrlSafe]);

  // Server handshake readiness
  const serverReadyRef = useRef<boolean>(uiState.serverReady);
  React.useEffect(() => { serverReadyRef.current = uiState.serverReady; }, [uiState.serverReady]);
  const isMicOnRef = useRef<boolean>(uiState.isMicOn);
  React.useEffect(() => { isMicOnRef.current = uiState.isMicOn; }, [uiState.isMicOn]);
  // Mirror of wsStatus for early callbacks before declaration
  const wsStatusRef = useRef<WsStatus>(WsStatus.Disconnected);

  // Bridge sendMessage to audio hook without TDZ issues
  const sendMessageRef = useRef<(data: unknown) => void>(() => {});
  const onMicData = useCallback((base64: string) => {
    // Strict gating: drop frames unless online, server-ready, mic on, not in tool call, and connected
    const canSend = uiState.isOnline && serverReadyRef.current && uiState.serverAlive && isMicOnRef.current && !isToolCallActive && wsStatusRef.current === WsStatus.Connected;
    if (canSend) {
      sendMessageRef.current({ mime_type: 'audio/pcm', data: base64 });
    }
  }, [uiState.isOnline, uiState.serverAlive, isToolCallActive]);
  const { startMic, stopMic, playAudioChunk, clearPlaybackQueue, setStreamingEnabled } = useAudioProcessor(onMicData, addLog);

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
      // Reset handshake readiness
      setUiState(prev => ({ ...prev, serverReady: false, serverAlive: true }));
      // Reset server alive status and heartbeat timer on reconnection
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
      // Use the reconnection hook's manual disconnect
      sessionReconnection.manualDisconnect();
      // Clean up audio
      audioPlayback.cleanup();
      sessionMode.setDisconnected();
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addLog, sessionReconnection, audioPlayback, sessionMode]);

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
    audioPlayback.playConnectedSound();
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
  }, [addLog, audioPlayback, playAudioChunk, sessionMode]);

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
  
  const handleTurnControl = useCallback((msg: WireMessage) => {
    addLog(LogLevel.Event, 'Turn Control', msg);
    if (msg?.interrupted) {
      clearPlaybackQueue();
    }
    audioPlayback.endToolCall();
    setIsToolCallActive(false);
    sessionMode.stopThinking();
  }, [addLog, audioPlayback, clearPlaybackQueue, sessionMode]);

  const handleAudioData = useCallback((msg: WireMessage) => {
    if (msg.mime_type?.startsWith('audio/')) {
      audioPlayback.playModelAudio();
      playAudioChunk(msg.data as string);
      sessionMode.startResponding(2500);
      setTimeout(() => audioPlayback.endModelAudio(), 2500);
    }
  }, [audioPlayback, playAudioChunk, sessionMode]);

  const onWsMessage = useCallback((data: unknown) => {
    lastWsMessageAtRef.current = Date.now();
    const msg = data as WireMessage;

    // Event-based messages
    if (msg.event) {
      switch (msg.event) {
        case 'ready': return handleReady();
        case 'session_resumed': return msg.state && handleSessionResumed(msg.state);
        case 'speech_start':
        case 'speech_end': return handleSpeechControl(msg.event);
        case 'audio_buffer': return handleAudioBuffer(msg.frames || []);
        case 'heartbeat': return handleHeartbeat(msg as HeartbeatEvent);
        case 'function_call': return handleFunctionCall();
        case 'function_response': return handleFunctionResponse();
        case 'interrupt': return clearPlaybackQueue();
        default:
          addLog(LogLevel.Event, msg.event, msg.name || msg.data);
          return;
      }
    }

    // Turn control messages
    if (msg?.turn_complete !== undefined || msg?.interrupted !== undefined) {
      return handleTurnControl(msg);
    }

    // Audio data messages
    if (msg?.mime_type && msg?.data) {
      return handleAudioData(msg);
    }
  }, [
    addLog, clearPlaybackQueue, handleAudioBuffer, handleAudioData, handleFunctionCall,
    handleFunctionResponse, handleHeartbeat, handleReady, handleSessionResumed,
    handleSpeechControl, handleTurnControl
  ]);

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
    // Always release microphone hardware and reset streaming gate on close
    stopMic();
    // Clean up audio playback
    audioPlayback.cleanup();
    addLog(LogLevel.Audio, 'Disabling streaming');
    setUiState(prev => ({ ...prev, serverReady: false }));
    sessionMode.resetToIdle();
    // Clear playback queue to avoid replay on reconnect
    clearPlaybackQueue();
    // Handle reconnection through the hook
    sessionReconnection.handleConnectionClose(code, reason, wasManual);
  }, [addLog, stopMic, audioPlayback, setStreamingEnabled, sessionMode, clearPlaybackQueue, sessionReconnection]);

  const onWsError = useCallback((event?: Event) => addLog(LogLevel.Error, 'WebSocket error', event), [addLog]);
  const { connect, disconnect, sendMessage, status: wsStatus } = useWebSocket(wsUrl, () => onWsOpenRef.current(), onWsMessage, onWsClose, onWsError);
  // Keep status in a ref for early consumers
  React.useEffect(() => { wsStatusRef.current = wsStatus; }, [wsStatus]);

  // Keep sendMessage ref in sync
  React.useEffect(() => {
    sendMessageRef.current = (data: unknown) => sendMessage(data);
  }, [sendMessage]);

  // Server liveness monitor: if no heartbeat for 20s, mark serverAlive=false
  React.useEffect(() => {
    const t = window.setInterval(() => {
      const since = Date.now() - lastHeartbeatAtRef.current;
      if (since > 20000 && uiState.serverAlive) setUiState(prev => ({ ...prev, serverAlive: false }));
    }, 5000);
    return () => { try { window.clearInterval(t); } catch {} };
  }, [uiState.serverAlive]);

  // Keep streamingEnabled in sync with connection + readiness + mic state
  React.useEffect(() => {
    const shouldEnable = uiState.isOnline && wsStatus === WsStatus.Connected && uiState.serverReady && uiState.isMicOn && uiState.serverAlive && !isToolCallActive;
    setStreamingEnabled(shouldEnable);
    try { addLog(LogLevel.Audio, `Streaming ${shouldEnable ? 'enabled' : 'disabled'} (sync)`); } catch {}
  }, [uiState.isOnline, wsStatus, uiState.serverReady, uiState.isMicOn, uiState.serverAlive, isToolCallActive, setStreamingEnabled, addLog]);

  // Reset to idle when mic state changes
  React.useEffect(() => {
    sessionMode.resetToIdle();
  }, [uiState.isMicOn, sessionMode]);

  // Reset local loading flags on status changes
  React.useEffect(() => {
    if (wsStatus !== WsStatus.Connecting) setUiState(prev => ({ ...prev, isConnecting: false }));
    if (wsStatus === WsStatus.Disconnected) setUiState(prev => ({ ...prev, isDisconnecting: false }));
  }, [wsStatus]);

  // UI status pill meta for header
  const statusMeta = React.useMemo(() => {
    const modeSuffix = ((): string => {
      if (!uiState.isOnline) return '';
      if (wsStatus !== WsStatus.Connected || !uiState.serverReady) return '';
      if (uiState.isListening) return ' • Listening';
      if (sessionMode.mode === 'thinking') return ' • Thinking';
      if (sessionMode.mode === 'responding') return ' • Responding';
      return '';
    })();

    // Show resumption status
    if (sessionReconnection.isReconnecting) {
      const attemptText = sessionReconnection.reconnectAttempts > 0 ? ` (attempt ${sessionReconnection.reconnectAttempts + 1})` : '';
      return { text: `Connection lost, attempting to resume…${attemptText}`, classes: 'bg-amber-100 text-amber-700 border border-amber-200 animate-pulse' };
    }
    if (sessionReconnection.connectionState.hasResumed && wsStatus === WsStatus.Connected) {
      const resumeText = sessionReconnection.connectionState.backendSessionState?.hasPendingFunctions
        ? 'Session resumed • Tools were active'
        : 'Session resumed successfully';
      return { text: resumeText, classes: 'bg-green-100 text-green-700 border border-green-200' };
    }

    if (!uiState.isOnline) return { text: 'Offline: Please check your network connection.', classes: 'bg-red-100 text-red-700 border border-red-200' };
    if (wsStatus === WsStatus.Connected && uiState.serverReady) {
      if (!uiState.serverAlive) return { text: 'Connected (Server unresponsive, retrying...)', classes: 'bg-amber-100 text-amber-700 border border-amber-200' };
      return { text: `Connected${modeSuffix}`.trim(), classes: 'bg-emerald-100 text-emerald-700 border border-emerald-200' };
    }
    if (wsStatus === WsStatus.Connected && !uiState.serverReady) return { text: 'Finalizing connection…', classes: 'bg-amber-100 text-amber-700 border border-amber-200' };
    if (wsStatus === WsStatus.Connecting || uiState.isConnecting) return { text: 'Connecting…', classes: 'bg-amber-100 text-amber-700 border border-amber-200' };
    if (wsStatus === WsStatus.Error) return { text: 'Connection Error', classes: 'bg-red-100 text-red-700 border border-red-200' };
    return { text: 'Disconnected', classes: 'bg-gray-100 text-gray-700 border border-gray-200' };
  }, [wsStatus, uiState.isConnecting, uiState.isOnline, sessionMode.mode, uiState.serverReady, sessionReconnection, uiState.isListening, uiState.serverAlive]);

  const advisorMode: IAdvisorMode = React.useMemo(() => {
    if (!uiState.isOnline) return 'disconnected';
    if (wsStatus === WsStatus.Connecting || uiState.isConnecting) return 'connecting';
    if (wsStatus === WsStatus.Error || wsStatus === WsStatus.Disconnected) return 'disconnected';
    // Connected
    if (!uiState.serverReady) return 'connecting';
    // Map session mode to advisor mode
    if (sessionMode.mode === 'connecting') return 'connecting';
    if (sessionMode.mode === 'disconnected') return 'disconnected';
    return sessionMode.mode; // idle, thinking, responding are compatible
  }, [uiState.isOnline, wsStatus, uiState.isConnecting, sessionMode.mode, uiState.serverReady]);

  const advisorDisabled = !uiState.isOnline || wsStatus !== WsStatus.Connected || !uiState.serverReady;

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto p-4">
      <div className="flex-shrink-0 flex justify-between items-center mb-4 gap-3 flex-col md:flex-row">
        <div className="w-full">
          <h1 className="text-xl md:text-2xl font-semibold">Session</h1>
          <p className="text-sm md:text-base text-muted-foreground">Connexion et dictée audio en temps réel.</p>
          <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${statusMeta.classes}`}>{statusMeta.text}</div>
        </div>
        <Button className="w-full md:w-auto" variant="secondary" onClick={() => router.replace(clientIdParam ? `/session?clientId=${clientIdParam}` : '/session')}>
          Retour aux sessions
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4">
        {/* IAdvisor Panel (top) */}
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">IAdvisor</CardTitle>
            </CardHeader>
            <CardContent>
              <IAdvisor
                active={uiState.isMicOn}
                onToggle={advisorDisabled ? undefined : async () => {
                  if (!uiState.isMicOn) {
                    addLog(LogLevel.Audio, 'User enabled microphone - attempting to start mic hardware');
                    setUiState(prev => ({ ...prev, isMicOn: true }));
                    sessionMode.resetToIdle();
                    try {
                      await startMic();
                      addLog(LogLevel.Audio, 'Microphone hardware started successfully');
                    } catch (err) {
                      addLog(LogLevel.Error, 'Failed to start microphone hardware', err);
                    }
                  } else {
                    addLog(LogLevel.Audio, 'User disabled microphone');
                    setUiState(prev => ({ ...prev, isMicOn: false }));
                    sessionMode.resetToIdle();
                    stopMic();
                  }
                }}
                wsMode={advisorMode}
                disabled={advisorDisabled}
              />
            </CardContent>
          </Card>
        </div>

        {/* Connection panel (bottom) */}
        <div className="col-span-1">
          <Card className="h-full" data-testid="connection-card">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Connexion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {wsStatus !== WsStatus.Connected ? (
                  <Button
                    className="w-full"
                    onClick={async () => {
                      setUiState(prev => ({ ...prev, isConnecting: true }));
                      try {
                        if (!backendBase) {
                          setUiState(prev => ({ ...prev, isConnecting: false }));
                          addLog(LogLevel.Error, 'Missing NEXT_PUBLIC_BACKEND_BASE_URL');
                          return;
                        }
                        await sessionReconnection.manualConnect(false);
                      } catch (err) {
                        setUiState(prev => ({ ...prev, isConnecting: false }));
                        addLog(LogLevel.Error, 'Failed to connect', err);
                      }
                    }}
                    variant="default"
                    disabled={!uiState.isOnline || !backendBase || wsStatus === WsStatus.Connecting || uiState.isConnecting}
                  >
                    {(uiState.isConnecting || wsStatus === WsStatus.Connecting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {(uiState.isConnecting || wsStatus === WsStatus.Connecting) ? 'Connexion…' : 'Connecter'}
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => {
                      setUiState(prev => ({ ...prev, isDisconnecting: true }));
                      try { sendMessageRef.current({ event: 'client_disconnect', intent: 'manual' }); } catch {}
                      sessionReconnection.manualDisconnect();
                    }}
                    variant="secondary"
                    disabled={!uiState.isOnline || uiState.isDisconnecting}
                  >
                    {uiState.isDisconnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {uiState.isDisconnecting ? 'Déconnexion…' : 'Déconnecter'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

