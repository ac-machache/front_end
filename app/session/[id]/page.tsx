"use client";
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import IAdvisor, { type IAdvisorMode } from '@/components/kokonutui/IAdvisor';
import type { Config, SessionResumedEvent, HeartbeatEvent } from '@/lib/types';
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
  const [isMicOn, setIsMicOn] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [serverAlive, setServerAlive] = useState<boolean>(true);
  const lastHeartbeatAtRef = useRef<number>(Date.now());
  const [isListening, setIsListening] = useState<boolean>(false);

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
  const serverReadyRef = useRef<boolean>(false);
  const [serverReady, setServerReady] = useState<boolean>(false);
  React.useEffect(() => { serverReadyRef.current = serverReady; }, [serverReady]);
  const isMicOnRef = useRef<boolean>(isMicOn);
  React.useEffect(() => { isMicOnRef.current = isMicOn; }, [isMicOn]);
  // Mirror of wsStatus for early callbacks before declaration
  const wsStatusRef = useRef<WsStatus>(WsStatus.Disconnected);

  // Bridge sendMessage to audio hook without TDZ issues
  const sendMessageRef = useRef<(data: unknown) => void>(() => {});
  const onMicData = useCallback((base64: string) => {
    // Strict gating: drop frames unless online, server-ready, mic on, not in tool call, and connected
    const canSend = isOnline && serverReadyRef.current && serverAlive && isMicOnRef.current && !audioPlayback.isToolCallActive() && wsStatusRef.current === WsStatus.Connected;
    if (canSend) {
      sendMessageRef.current({ mime_type: 'audio/pcm', data: base64 });
    }
  }, [isOnline, serverAlive, audioPlayback]);
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
      setServerReady(false);
    };
  }, [addLog, sessionMode]);

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addLog(LogLevel.Ws, 'Browser online');
    };
    const handleOffline = () => {
      setIsOnline(false);
      addLog(LogLevel.Ws, 'Browser offline');
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
  };
  const onWsMessage = useCallback((data: unknown) => {
    const msg = data as WireMessage;
    if (msg?.event) {
      // Server handshake ready event
      if (msg.event === 'ready') {
        addLog(LogLevel.Event, 'Server ready - audio can now be sent', {
          micOn: isMicOnRef.current,
          toolCallActive: audioPlayback.isToolCallActive(),
          wsStatus: wsStatusRef.current
        });
        // Play connected sound
        audioPlayback.playConnectedSound();

        // If we are reconnecting and mic was ON before, auto-resume streaming
        if (sessionReconnection.isReconnecting && isMicOnRef.current) {
          setStreamingEnabled(true);
        }

        serverReadyRef.current = true;
        setServerReady(true);
        return;
      }

      // Interrupt: stop any playback so user can speak over model
      if (msg.event === 'interrupt') {
        clearPlaybackQueue();
        return;
      }

      // Session resumption events
      if (msg.event === 'session_resumed') {
        const resumeEvent = msg as SessionResumedEvent;
        addLog(LogLevel.Resume, 'Session resumed', resumeEvent.state);
        sessionReconnection.handleSessionResumed(resumeEvent.state);
        return;
      }

      // Speech control events
      if (msg.event === 'speech_start') {
        setIsListening(true);
        clearPlaybackQueue();
        return;
      }
      if (msg.event === 'speech_end') {
        setIsListening(false);
        return;
      }

      // Audio buffer frames sent on resume
      if (msg.event === 'audio_buffer') {
        const frames = msg.frames;
        if (Array.isArray(frames) && frames.length > 0) {
          audioPlayback.playModelAudio();
          for (const f of frames) {
            if (f?.mime_type?.startsWith('audio/')) {
              playAudioChunk(f.data);
            }
          }
          sessionMode.startResponding(2500);
          addLog(LogLevel.Event, 'Played audio_buffer frames', { count: frames.length });
        }
        return;
      }

      // Handle heartbeat from server
      if (msg.event === 'heartbeat') {
        const heartbeatEvent = msg as HeartbeatEvent;
        sendMessageRef.current({
          "event": "heartbeat_response",
          "timestamp": Date.now(),
          "server_timestamp": heartbeatEvent.timestamp
        });
        lastHeartbeatAtRef.current = Date.now();
        if (!serverAlive) setServerAlive(true);
        addLog(LogLevel.Event, 'Heartbeat received and responded', {
          server_timestamp: heartbeatEvent.timestamp,
          data: heartbeatEvent.data
        });
        return;
      }

      // Function call events
      if (msg.event === 'function_call') {
        sessionMode.startThinking();
        addLog(LogLevel.Audio, 'Disabling streaming');
        setStreamingEnabled(false);
        audioPlayback.startToolCall();
        return;
      }

      if (msg.event === 'function_response') {
        audioPlayback.endToolCall();
        setStreamingEnabled(true);
        sessionMode.stopThinking();
        return;
      }

      addLog(LogLevel.Event, msg.event, msg.name || msg.data);
      return;
    }

    // Turn control messages
    if (msg?.turn_complete !== undefined || msg?.interrupted !== undefined) {
      addLog(LogLevel.Event, 'Turn Control', msg);
      if (msg?.interrupted) {
        clearPlaybackQueue();
      }
      audioPlayback.endToolCall();
      setStreamingEnabled(true);
      sessionMode.stopThinking();
      return;
    }

    // Audio data messages
    if (msg?.mime_type && msg?.data) {
      if (msg.mime_type.startsWith('audio/')) {
        audioPlayback.playModelAudio();
        playAudioChunk(msg.data as string);
        sessionMode.startResponding(2500);
        return;
      }
    }
  }, [addLog, audioPlayback, sessionReconnection, sessionMode, playAudioChunk, setStreamingEnabled, clearPlaybackQueue]);
  const onWsClose = useCallback((code?: number, reason?: string, wasManual?: boolean) => {
    addLog(LogLevel.Ws, 'WebSocket disconnected', { code, reason, wasManual });
    // Always release microphone hardware and reset streaming gate on close
    stopMic();
    // Clean up audio playback
    audioPlayback.cleanup();
    addLog(LogLevel.Audio, 'Disabling streaming');
    setStreamingEnabled(false);
    setServerReady(false);
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
      if (since > 20000 && serverAlive) setServerAlive(false);
    }, 5000);
    return () => { try { window.clearInterval(t); } catch {} };
  }, [serverAlive]);

  // Keep streamingEnabled in sync with connection + readiness + mic state
  React.useEffect(() => {
    const shouldEnable = isOnline && wsStatus === WsStatus.Connected && serverReady && isMicOn && sessionMode.mode !== 'thinking';
    setStreamingEnabled(shouldEnable);
    try { addLog(LogLevel.Audio, `Streaming ${shouldEnable ? 'enabled' : 'disabled'} (sync)`); } catch {}
  }, [isOnline, wsStatus, serverReady, isMicOn, sessionMode.mode, setStreamingEnabled, addLog]);

  // Reset to idle when mic state changes
  React.useEffect(() => {
    sessionMode.resetToIdle();
  }, [isMicOn, sessionMode]);

  // Reset local loading flags on status changes
  React.useEffect(() => {
    if (wsStatus !== WsStatus.Connecting) setIsConnecting(false);
    if (wsStatus === WsStatus.Disconnected) setIsDisconnecting(false);
  }, [wsStatus]);

  // UI status pill meta for header
  const statusMeta = React.useMemo(() => {
    const modeSuffix = ((): string => {
      if (!isOnline) return '';
      if (wsStatus !== WsStatus.Connected || !serverReady) return '';
      if (isListening) return ' • Écoute';
      if (sessionMode.mode === 'thinking') return ' • En réflexion';
      if (sessionMode.mode === 'responding') return ' • Réponse';
      return '';
    })();

    // Show resumption status
    if ((sessionReconnection.isReconnecting || sessionReconnection.connectionState.isResuming) && (wsStatus === WsStatus.Connecting || isConnecting)) {
      const attemptText = sessionReconnection.reconnectAttempts > 0 ? ` (tentative ${sessionReconnection.reconnectAttempts})` : '';
      return { text: `Reprise de session…${attemptText}`, classes: 'bg-blue-100 text-blue-700 border border-blue-200' };
    }
    if (sessionReconnection.connectionState.hasResumed && wsStatus === WsStatus.Connected) {
      const resumeText = sessionReconnection.connectionState.backendSessionState?.hasPendingFunctions
        ? 'Session reprise • Outils actifs'
        : 'Session reprise';
      // Don't show mode suffix during resumption display
      return { text: resumeText, classes: 'bg-green-100 text-green-700 border border-green-200' };
    }

    if (!isOnline) return { text: 'Hors ligne', classes: 'bg-red-100 text-red-700 border border-red-200' };
    if (wsStatus === WsStatus.Connected && serverReady) {
      if (!serverAlive) return { text: 'Connecté (pas de réponse serveur)', classes: 'bg-amber-100 text-amber-700 border border-amber-200' };
      return { text: `Connecté${modeSuffix}`.trim(), classes: 'bg-emerald-100 text-emerald-700 border border-emerald-200' };
    }
    if (wsStatus === WsStatus.Connected && !serverReady) return { text: 'Synchronisation…', classes: 'bg-amber-100 text-amber-700 border border-amber-200' };
    if (wsStatus === WsStatus.Connecting || isConnecting) return { text: 'Connexion…', classes: 'bg-amber-100 text-amber-700 border border-amber-200' };
    if (wsStatus === WsStatus.Error) return { text: 'Erreur de connexion', classes: 'bg-red-100 text-red-700 border border-red-200' };
    return { text: 'Déconnecté', classes: 'bg-gray-100 text-gray-700 border border-gray-200' };
  }, [wsStatus, isConnecting, isOnline, sessionMode.mode, serverReady, sessionReconnection, isListening, serverAlive]);

  const advisorMode: IAdvisorMode = React.useMemo(() => {
    if (!isOnline) return 'disconnected';
    if (wsStatus === WsStatus.Connecting || isConnecting) return 'connecting';
    if (wsStatus === WsStatus.Error || wsStatus === WsStatus.Disconnected) return 'disconnected';
    // Connected
    if (!serverReady) return 'connecting';
    // Map session mode to advisor mode
    if (sessionMode.mode === 'connecting') return 'connecting';
    if (sessionMode.mode === 'disconnected') return 'disconnected';
    return sessionMode.mode; // idle, thinking, responding are compatible
  }, [isOnline, wsStatus, isConnecting, sessionMode.mode, serverReady]);

  const advisorDisabled = !isOnline || wsStatus !== WsStatus.Connected || !serverReady;

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

      <div className="flex-grow overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-full">
          <div className="col-span-1 md:col-span-5 h-full">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Événements</CardTitle>
              </CardHeader>
              <CardContent className="overflow-hidden h-[calc(100%-3rem)] flex flex-col gap-4">
                {!isOnline && (
                  <div className="w-full text-sm px-3 py-2 rounded-md bg-red-50 text-red-700 border border-red-200">
                    Hors ligne : vérifiez votre connexion internet.
                  </div>
                )}
                {isOnline && (!backendBase || wsStatus !== WsStatus.Connected) && (
                  <div className="w-full text-sm px-3 py-2 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                    {!backendBase
                      ? 'Configuration manquante: NEXT_PUBLIC_BACKEND_BASE_URL.'
                      : (wsStatus === WsStatus.Connecting || isConnecting ? 'Connexion en cours…' : 'Non connecté au serveur.')}
                  </div>
                )}
                <div className="flex-1 overflow-auto bg-background border rounded-md p-4 flex items-center justify-center">
                  <IAdvisor
                    active={isMicOn}
                    onToggle={advisorDisabled ? undefined : async () => {
                      if (!isMicOn) {
                        addLog(LogLevel.Audio, 'User enabled microphone - attempting to start mic hardware');
                        addLog(LogLevel.Audio, 'Setting streaming enabled = true');
                        setStreamingEnabled(true);
                        setIsMicOn(true);
                        sessionMode.resetToIdle();
                        // Manually start mic to debug
                        try {
                          await startMic();
                          addLog(LogLevel.Audio, 'Microphone hardware started successfully');
                        } catch (err) {
                          addLog(LogLevel.Error, 'Failed to start microphone hardware', err);
                        }
                      } else {
                        addLog(LogLevel.Audio, 'User disabled microphone');
                        addLog(LogLevel.Audio, 'Disabling streaming');
                        setStreamingEnabled(false);
                        setIsMicOn(false);
                        sessionMode.resetToIdle();
                        stopMic();
                      }
                    }}
                    wsMode={advisorMode}
                    disabled={advisorDisabled}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Connection panel */}
        <div className="col-span-1 md:col-span-5 md:sticky md:top-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Connexion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full"
                  onClick={async () => {
                    // Start mic hardware on Connect; streaming remains gated by mic button
                    setIsConnecting(true);
                    try {
                      if (!backendBase) {
                        setIsConnecting(false);
                        addLog(LogLevel.Error, 'Missing NEXT_PUBLIC_BACKEND_BASE_URL');
                        return;
                      }
                      await sessionReconnection.manualConnect(false);
                    } catch (err) {
                      setIsConnecting(false);
                      addLog(LogLevel.Error, 'Failed to connect', err);
                    }
                  }}
                  variant={(!isOnline || wsStatus === WsStatus.Connected || wsStatus === WsStatus.Connecting) ? 'secondary' : 'default'}
                  disabled={!isOnline || !backendBase || wsStatus === WsStatus.Connected || wsStatus === WsStatus.Connecting || isConnecting}
                >
                  {(isConnecting || wsStatus === WsStatus.Connecting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {(isConnecting || wsStatus === WsStatus.Connecting) ? 'Connexion…' : 'Connecter'}
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    // Release mic hardware cleanly on Disconnect
                    setIsDisconnecting(true);
                    // Inform backend of manual disconnect intent before closing
                    try { sendMessageRef.current({ event: 'client_disconnect', intent: 'manual' }); } catch {}
                    sessionReconnection.manualDisconnect();
                  }}
                  variant={wsStatus === WsStatus.Connected ? 'default' : 'secondary'}
                  disabled={!isOnline || wsStatus !== WsStatus.Connected || isDisconnecting}
                >
                  {isDisconnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isDisconnecting ? 'Déconnexion…' : 'Déconnecter'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

