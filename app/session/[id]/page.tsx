"use client";
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import IAdvisor, { type IAdvisorMode } from '@/components/kokonutui/IAdvisor';
import type { Config, SessionResumedEvent, ConnectionState, HeartbeatEvent } from '@/lib/types';
import { LogLevel, WsStatus } from '@/lib/types';
import { useLocalStorage, useWebSocket, useAudioProcessor } from '@/lib/hooks';
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
  
  // Enhanced connection state for session resumption
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isResuming: false,
    hasResumed: false,
  });

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

  const addLog = useCallback((level: LogLevel, message: string, data?: unknown) => {
    // Log to console for debugging - could implement UI logging later if needed
    console.log(`[${level}] ${message}`, data);
  }, []);

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

  // Define after useAudioProcessor to avoid TDZ; then assign in effect
  const onWsOpenRef = useRef<() => void>(() => {});

  // Server handshake readiness and mic toggle persistence
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
    const canSend = isOnline && serverReadyRef.current && serverAlive && isMicOnRef.current && !toolCallActiveRef.current && wsStatusRef.current === WsStatus.Connected;
    if (canSend) {
      sendMessageRef.current({ mime_type: 'audio/pcm', data: base64 });
    }
  }, [isOnline, serverAlive]);
  const { startMic, stopMic, playAudioChunk, clearPlaybackQueue, setStreamingEnabled } = useAudioProcessor(onMicData, addLog);
  React.useEffect(() => {
    onWsOpenRef.current = () => {
      addLog(LogLevel.Ws, 'WebSocket connected.');
      // Do not auto-enable streaming or mic; wait for server 'ready' and user toggle
      setMode('idle');
      // Reset handshake readiness
      setServerReady(false);
    };
  }, [addLog]);
  React.useEffect(() => {
    try {
      const a = new Audio('/Thinking.mp3');
      a.preload = 'auto';
      toolSoundRef.current = a;
      const c = new Audio('/Connected.mp3');
      c.preload = 'auto';
      connectedSoundRef.current = c;
    } catch {}
  }, []);
  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addLog(LogLevel.Ws, 'Browser online');
    };
    const handleOffline = () => {
      setIsOnline(false);
      addLog(LogLevel.Ws, 'Browser offline');
      try { if (reconnectTimerRef.current != null) { window.clearTimeout(reconnectTimerRef.current); reconnectTimerRef.current = null; } } catch {}
      shouldAutoReconnectRef.current = false;
      manualDisconnectRef.current = true;
      try { disconnectRef.current(); } catch {}
      try { stopMicRef.current(); } catch {}
      try { 
        addLog(LogLevel.Audio, 'Disabling streaming');
        setStreamingEnabled(false); 
      } catch {}
      // Inline stop of tool loop to avoid dependency issues
      try { const a = toolSoundRef.current; if (a) { a.loop = false; a.pause(); a.currentTime = 0; } } catch {}
      toolCallActiveRef.current = false;
      // Preserve user's mic toggle; it will remain disabled by connection status
      setMode('idle');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addLog, setStreamingEnabled]);
  const [mode, setMode] = useState<IAdvisorMode>('idle');
  const speakTimerRef = useRef<number | null>(null);
  const disconnectRef = useRef<() => void>(() => {});
  const stopMicRef = useRef<() => void>(() => {});
  const connectRef = useRef<() => void>(() => {});
  const startMicRef = useRef<() => Promise<void>>(async () => {});
  const manualDisconnectRef = useRef<boolean>(false);
  const shouldAutoReconnectRef = useRef<boolean>(true);
  const reconnectAttemptsRef = useRef<number>(0);
  const reconnectTimerRef = useRef<number | null>(null);
  const toolSoundRef = useRef<HTMLAudioElement | null>(null);
  const connectedSoundRef = useRef<HTMLAudioElement | null>(null);
  const toolLoopingRef = useRef<boolean>(false);
  const toolCallActiveRef = useRef<boolean>(false);
  const thinkingTimeoutRef = useRef<number | null>(null);
  
  const reconnectingRef = useRef<boolean>(false);
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false);

  const startToolSoundLoop = useCallback(() => {
    try {
      const a = toolSoundRef.current;
      if (!a) return;
      a.loop = true;
      a.currentTime = 0;
      toolLoopingRef.current = true;
      void a.play()?.catch(() => { try { addLog(LogLevel.Audio, 'Tool loop play blocked (autoplay)'); } catch {} });
    } catch {}
  }, [addLog]);

  const stopToolSoundLoop = useCallback(() => {
    try {
      const a = toolSoundRef.current;
      if (!a) return;
      a.loop = false;
      a.pause();
      a.currentTime = 0;
      toolLoopingRef.current = false;
    } catch {}
  }, []);

  const clearThinkingTimeout = useCallback(() => {
    try { if (thinkingTimeoutRef.current) { window.clearTimeout(thinkingTimeoutRef.current); thinkingTimeoutRef.current = null; } } catch {}
  }, []);

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
        try { 
          addLog(LogLevel.Event, 'Server ready - audio can now be sent', {
            micOn: isMicOnRef.current,
            toolCallActive: toolCallActiveRef.current,
            wsStatus: wsStatusRef.current
          }); 
          // Play a short cue to inform the user the model is ready
          try {
            const s = connectedSoundRef.current;
            if (s) { s.currentTime = 0; void s.play()?.catch(() => {}); }
          } catch {}
        } catch {}
        // If we are reconnecting and mic was ON before, auto-resume streaming
        if (reconnectingRef.current && isMicOnRef.current) {
          try { setStreamingEnabled(true); } catch {}
        }
        reconnectingRef.current = false;
        setIsReconnecting(false);
        serverReadyRef.current = true;
        setServerReady(true);
        return;
      }
      // Interrupt: stop any playback so user can speak over model
      if (msg.event === 'interrupt') {
        try { clearPlaybackQueueRef.current(); } catch {}
        return;
      }
      
      // Session resumption events
      if (msg.event === 'session_resumed') {
        const resumeEvent = msg as SessionResumedEvent;
        try { 
          addLog(LogLevel.Resume, 'Session resumed', resumeEvent.state); 
          setConnectionState(prev => ({
            ...prev,
            hasResumed: true,
            isResuming: false,
            backendSessionState: {
              mode: resumeEvent.state.mode,
              turnId: resumeEvent.state.turn_id,
              hasPendingFunctions: resumeEvent.state.has_pending_functions
            }
          }));
          
          // Clear "has resumed" status after 5 seconds
          setTimeout(() => {
            setConnectionState(prev => ({ ...prev, hasResumed: false }));
          }, 5000);
        } catch {}
        return;
      }

      // New speech control events
      if (msg.event === 'speech_start') {
        try { setIsListening(true); } catch {}
        // Immediately stop any current playback so the user can talk over the model
        try { clearPlaybackQueueRef.current(); } catch {}
        return;
      }
      if (msg.event === 'speech_end') {
        try { setIsListening(false); } catch {}
        return;
      }

      // New: audio_buffer frames sent on resume; play them sequentially
      if (msg.event === 'audio_buffer') {
        try {
          const frames = msg.frames;
          if (Array.isArray(frames) && frames.length > 0) {
            // Stop any tool loop; we have audio to play
            if (toolCallActiveRef.current || toolLoopingRef.current) {
              toolCallActiveRef.current = false;
              stopToolSoundLoop();
            }
            clearThinkingTimeout();
            for (const f of frames) {
              if (f?.mime_type?.startsWith('audio/')) {
                playAudioChunk(f.data);
              }
            }
            setMode('responding');
            if (speakTimerRef.current) window.clearTimeout(speakTimerRef.current);
            speakTimerRef.current = window.setTimeout(() => setMode('idle'), 2500);
          }
          addLog(LogLevel.Event, 'Played audio_buffer frames', { count: Array.isArray(msg.frames) ? msg.frames.length : 0 });
        } catch {}
        return;
      }
      
      // Handle heartbeat from server
      if (msg.event === 'heartbeat') {
        const heartbeatEvent = msg as HeartbeatEvent;
        try {
          // Respond to server heartbeat
          sendMessageRef.current({
            "event": "heartbeat_response",
            "timestamp": Date.now(),
            "server_timestamp": heartbeatEvent.timestamp
          });
          // Track liveness based on last heartbeat
          lastHeartbeatAtRef.current = Date.now();
          if (!serverAlive) setServerAlive(true);
          addLog(LogLevel.Event, 'Heartbeat received and responded', { 
            server_timestamp: heartbeatEvent.timestamp,
            data: heartbeatEvent.data 
          });
        } catch {}
        return;
      }
      
      if (msg.event === 'function_call') {
        setMode('thinking');
        // Pause upstream audio during tool calls (keep mic hardware on)
        try { 
        addLog(LogLevel.Audio, 'Disabling streaming');
        setStreamingEnabled(false); 
      } catch {}
        // Start looping tool sound until we receive model audio again
        toolCallActiveRef.current = true;
        startToolSoundLoop();
        // Safety: stop thinking after 30s if no response
        try { if (thinkingTimeoutRef.current) window.clearTimeout(thinkingTimeoutRef.current); } catch {}
        thinkingTimeoutRef.current = window.setTimeout(() => {
          try { addLog(LogLevel.Event, 'Thinking timeout'); } catch {}
          toolCallActiveRef.current = false;
          stopToolSoundLoop();
          try { setStreamingEnabled(true); } catch {}
          setMode('idle');
        }, 30000);
        // Do NOT set the pending flag yet; wait for the function_response to confirm the tool finished
      } else if (msg.event === 'function_response') {
        // Stop tool sound loop immediately when function completes
        if (toolCallActiveRef.current || toolLoopingRef.current) {
          toolCallActiveRef.current = false;
          stopToolSoundLoop();
        }
        clearThinkingTimeout();
        
        // Resume upstream audio streaming after function response
        try { setStreamingEnabled(true); } catch {}
        
        // If the model is (or was just) responding, prefer responding; otherwise idle
        if (speakTimerRef.current) {
          setMode('responding');
          window.clearTimeout(speakTimerRef.current);
          speakTimerRef.current = window.setTimeout(() => setMode('idle'), 800);
        } else {
          setMode('idle');
        }
      }
      addLog(LogLevel.Event, msg.event, msg.name || msg.data);
      return;
    }
    if (msg?.turn_complete !== undefined || msg?.interrupted !== undefined) {
      addLog(LogLevel.Event, 'Turn Control', msg);
      if (msg?.interrupted) {
        try { clearPlaybackQueueRef.current(); } catch {}
      }
      clearThinkingTimeout();
      // End any tool sound loop if still active (safety fallback)
      if (toolCallActiveRef.current || toolLoopingRef.current) {
        toolCallActiveRef.current = false;
        stopToolSoundLoop();
      }
      // Resume upstream audio streaming after turn completion
      try { setStreamingEnabled(true); } catch {}
      // Prefer responding if audio frames arrived very recently, else idle
      if (speakTimerRef.current) {
        setMode('responding');
        window.clearTimeout(speakTimerRef.current);
        speakTimerRef.current = window.setTimeout(() => setMode('idle'), 800);
      } else {
        setMode('idle');
      }
      return;
    }
    if (msg?.mime_type && msg?.data) {
      if (msg.mime_type.startsWith('audio/')) {
        // Stop tool sound loop when model audio arrives
        if (toolCallActiveRef.current || toolLoopingRef.current) {
          toolCallActiveRef.current = false;
          stopToolSoundLoop();
        }
        clearThinkingTimeout();
        playAudioChunk(msg.data as string);
        setMode('responding');
        if (speakTimerRef.current) window.clearTimeout(speakTimerRef.current);
        speakTimerRef.current = window.setTimeout(() => setMode('idle'), 2500);
        return;
      }
    }
  }, [addLog, playAudioChunk, setStreamingEnabled, clearThinkingTimeout, startToolSoundLoop, stopToolSoundLoop, serverAlive]);
  const onWsClose = useCallback((code?: number, reason?: string, wasManual?: boolean) => {
    addLog(LogLevel.Ws, 'WebSocket disconnected', { code, reason, wasManual });
    // Always release microphone hardware and reset streaming gate on close
    stopMic();
    // Ensure any tool sound loop is stopped on close
    toolCallActiveRef.current = false;
    stopToolSoundLoop();
    clearThinkingTimeout();
        addLog(LogLevel.Audio, 'Disabling streaming');
    setStreamingEnabled(false);
    setServerReady(false);
    setMode('idle');
    // Clear any speaking timers and playback queue to avoid replay on reconnect
    try { if (speakTimerRef.current) { window.clearTimeout(speakTimerRef.current); speakTimerRef.current = null; } } catch {}
    try { clearPlaybackQueue(); } catch {}
    // Reset resumption state on disconnect
    if (!wasManual) {
      reconnectingRef.current = true;
      setIsReconnecting(true);
      setConnectionState(prev => ({ ...prev, isResuming: true, hasResumed: false }));
    } else {
      reconnectingRef.current = false;
      setIsReconnecting(false);
      setConnectionState(prev => ({ ...prev, isResuming: false, hasResumed: false }));
    }
    
    // Auto-reconnect with backoff if not manual and allowed
    try { if (reconnectTimerRef.current != null) { window.clearTimeout(reconnectTimerRef.current); reconnectTimerRef.current = null; } } catch {}
    if (shouldAutoReconnectRef.current && !manualDisconnectRef.current && !wasManual) {
      const attempt = reconnectAttemptsRef.current;
      const delay = Math.min(5000, 1000 * Math.pow(2, attempt));
      reconnectTimerRef.current = window.setTimeout(async () => {
        try {
          setIsConnecting(true);
          if (isMicOnRef.current) {
            await startMicRef.current();
          }
          connectRef.current();
          reconnectAttemptsRef.current = 0;
        } catch (err) {
          reconnectAttemptsRef.current = attempt + 1;
          addLog(LogLevel.Error, 'Auto-reconnect attempt failed', err);
        }
      }, delay);
    }
  }, [addLog, stopMic, setStreamingEnabled, clearPlaybackQueue, clearThinkingTimeout, stopToolSoundLoop]);
  const onWsError = useCallback((event?: Event) => addLog(LogLevel.Error, 'WebSocket error', event), [addLog]);
  const { connect, disconnect, sendMessage, status: wsStatus } = useWebSocket(wsUrl, () => onWsOpenRef.current(), onWsMessage, onWsClose, onWsError);
  // Keep status in a ref for early consumers
  React.useEffect(() => { wsStatusRef.current = wsStatus; }, [wsStatus]);

  // Keep imperative refs in sync with latest functions
  React.useEffect(() => { stopMicRef.current = stopMic; }, [stopMic]);
  React.useEffect(() => { disconnectRef.current = disconnect; }, [disconnect]);
  React.useEffect(() => { connectRef.current = connect; }, [connect]);
  React.useEffect(() => { startMicRef.current = startMic; }, [startMic]);
  React.useEffect(() => () => { try { if (reconnectTimerRef.current != null) window.clearTimeout(reconnectTimerRef.current); } catch {} }, []);

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
    const shouldEnable = isOnline && wsStatus === WsStatus.Connected && serverReady && isMicOn && mode !== 'thinking';
    setStreamingEnabled(shouldEnable);
    try { addLog(LogLevel.Audio, `Streaming ${shouldEnable ? 'enabled' : 'disabled'} (sync)`); } catch {}
  }, [isOnline, wsStatus, serverReady, isMicOn, mode, setStreamingEnabled, addLog]);

  // Keep refs in sync once hooks return functions
  React.useEffect(() => {
    sendMessageRef.current = (data: unknown) => sendMessage(data);
  }, [sendMessage]);
  const clearPlaybackQueueRef = useRef<() => void>(() => {});
  React.useEffect(() => { clearPlaybackQueueRef.current = () => clearPlaybackQueue(); }, [clearPlaybackQueue]);

  // Manual connect only via UI controls to avoid auto-reconnect behavior
  React.useEffect(() => {
    setMode('idle');
  }, [isMicOn]);

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
      if (mode === 'thinking') return ' • En réflexion';
      if (mode === 'responding') return ' • Réponse';
      return '';
    })();
    
    // Show resumption status
    if ((isReconnecting || connectionState.isResuming) && (wsStatus === WsStatus.Connecting || isConnecting)) {
      return { text: 'Reprise de session…', classes: 'bg-blue-100 text-blue-700 border border-blue-200' };
    }
    if (connectionState.hasResumed && wsStatus === WsStatus.Connected) {
      const resumeText = connectionState.backendSessionState?.hasPendingFunctions 
        ? 'Session reprise • Outils actifs' 
        : 'Session reprise';
      return { text: `${resumeText}${modeSuffix}`.trim(), classes: 'bg-green-100 text-green-700 border border-green-200' };
    }
    
    if (!isOnline) return { text: 'Hors ligne', classes: 'bg-red-100 text-red-700 border border-red-200' };
    if (wsStatus === WsStatus.Connected && serverReady) {
      if (!serverAlive) return { text: 'Connecté (pas de réponse serveur)', classes: 'bg-amber-100 text-amber-700 border border-amber-200' };
      return { text: `Connecté${modeSuffix}`.trim(), classes: 'bg-emerald-100 text-emerald-700 border border-emerald-200' };
    }
    if (wsStatus === WsStatus.Connected && !serverReady) return { text: 'Synchronisation…', classes: 'bg-amber-100 text-amber-700 border border-amber-200' };
    if (wsStatus === WsStatus.Connecting || isConnecting) return { text: 'Connexion…', classes: 'bg-amber-100 text-amber-700 border border-amber-200' };
    if (wsStatus === WsStatus.Error) return { text: 'Erreur', classes: 'bg-red-100 text-red-700 border border-red-200' };
    return { text: 'Déconnecté', classes: 'bg-gray-100 text-gray-700 border border-gray-200' };
  }, [wsStatus, isConnecting, isOnline, mode, serverReady, connectionState, isListening, isReconnecting, serverAlive]);

  const advisorMode: IAdvisorMode = React.useMemo(() => {
    if (!isOnline) return 'disconnected';
    if (wsStatus === WsStatus.Connecting || isConnecting) return 'connecting';
    if (wsStatus === WsStatus.Error || wsStatus === WsStatus.Disconnected) return 'disconnected';
    // Connected
    if (!serverReady) return 'connecting';
    return mode; // mode is already IAdvisorMode compatible
  }, [isOnline, wsStatus, isConnecting, mode, serverReady]);

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
                        setMode('idle');
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
                        setMode('idle');
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
                    manualDisconnectRef.current = false;
                    shouldAutoReconnectRef.current = true;
                    try { if (reconnectTimerRef.current != null) { window.clearTimeout(reconnectTimerRef.current); reconnectTimerRef.current = null; } } catch {}
                    reconnectAttemptsRef.current = 0;
                    try {
                      if (!backendBase) {
                        setIsConnecting(false);
                        addLog(LogLevel.Error, 'Missing NEXT_PUBLIC_BACKEND_BASE_URL');
                        return;
                      }
                      await startMic();
                      connect();
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
                    manualDisconnectRef.current = true;
                    shouldAutoReconnectRef.current = false;
                    try { if (reconnectTimerRef.current != null) { window.clearTimeout(reconnectTimerRef.current); reconnectTimerRef.current = null; } } catch {}
                    reconnectAttemptsRef.current = 0;
                    // Inform backend of manual disconnect intent before closing
                    try { sendMessageRef.current({ event: 'client_disconnect', intent: 'manual' }); } catch {}
                    disconnect();
                    stopMic();
                    addLog(LogLevel.Audio, 'Disabling streaming: disconnect button clicked');
                    setStreamingEnabled(false);
                    setMode('idle');
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

