"use client";
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
// removed Loader2-based status row in events panel
import IAdvisor, { type IAdvisorMode } from '@/components/kokonutui/IAdvisor';
import type { Config, LogEntry } from '@/lib/types';
import { LogLevel, WsStatus } from '@/lib/types';
import { useLocalStorage, useWebSocket, useAudioProcessor, useApiClient } from '@/lib/hooks';
import { buildWsUrl } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

export default function SessionDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientIdParam = searchParams?.get('clientId') || '';
  const [config, setConfig] = useLocalStorage<Config>('app-config', { scheme: 'wss', host: 'localhost', port: '443', appName: 'app', userId: 'user', sessionId: '' });
  const [, setLogs] = useState<LogEntry[]>([]);
  const [isMicOn, setIsMicOn] = useState(false);
  // const [isHydrated, setIsHydrated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const logCounter = useRef(0);

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

  // React.useEffect(() => { setIsHydrated(true); }, []);

  const addLog = useCallback((level: LogLevel, message: string, data?: unknown) => {
    setLogs(prev => [...prev, { id: logCounter.current++, level, message, data, timestamp: new Date().toLocaleTimeString() }]);
  }, []);

  const wsUrl = useMemo(() => buildWsUrl(config), [config]);
  // No HTTP calls here; realtime over WebSocket only

  // Define after useAudioProcessor to avoid TDZ; then assign in effect
  const onWsOpenRef = useRef<() => void>(() => {});

  // Epochs and turn tracking for robustness
  const connectionEpochRef = useRef<number>(0);
  const turnIdRef = useRef<number>(0);
  // Mic backlog to buffer audio while connecting / thinking
  const micBacklogRef = useRef<string[]>([]);
  const MAX_MIC_BACKLOG = 30;
  // Mirror of wsStatus for early callbacks before declaration
  const wsStatusRef = useRef<WsStatus>(WsStatus.Disconnected);

  // Bridge sendMessage to audio hook without TDZ issues
  const sendMessageRef = useRef<(data: unknown) => void>(() => {});
  const onMicData = useCallback((base64: string) => {
    // Gate upstream: only send when online, connected and not inside a tool call
    // Otherwise buffer a small backlog to flush after resume
    const canSend = isOnline && !toolCallActiveRef.current && wsStatusRef.current === WsStatus.Connected;
    if (canSend) {
      sendMessageRef.current({ mime_type: 'audio/pcm', data: base64 });
    } else {
      if (micBacklogRef.current.length >= MAX_MIC_BACKLOG) {
        micBacklogRef.current.shift();
      }
      micBacklogRef.current.push(base64);
    }
  }, [isOnline]);
  const { startMic, stopMic, playAudioChunk, clearPlaybackQueue, setStreamingEnabled } = useAudioProcessor(onMicData, addLog);
  React.useEffect(() => {
    onWsOpenRef.current = () => {
      addLog(LogLevel.Ws, 'WebSocket connected.');
      try { setStreamingEnabled(true); } catch {}
      setIsMicOn(true);
      setMode('idle');
      hasIngestedRef.current = false;
      // New connection epoch
      connectionEpochRef.current += 1;
      // Attempt to flush any buffered mic frames
      try {
        if (isOnline && wsStatusRef.current === WsStatus.Connected && micBacklogRef.current.length > 0) {
          const frames = micBacklogRef.current.splice(0, micBacklogRef.current.length);
          for (const f of frames) sendMessageRef.current({ mime_type: 'audio/pcm', data: f });
          addLog(LogLevel.Audio, `Flushed ${frames.length} buffered mic frames`);
        }
      } catch {}
    };
  }, [addLog, setStreamingEnabled, isOnline]);
  React.useEffect(() => {
    try {
      const a = new Audio('/gradient.mp3');
      a.preload = 'auto';
      toolSoundRef.current = a;
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
      try { setStreamingEnabled(false); } catch {}
      // Inline stop of tool loop to avoid dependency issues
      try { const a = toolSoundRef.current; if (a) { a.loop = false; a.pause(); a.currentTime = 0; } } catch {}
      toolCallActiveRef.current = false;
      setIsMicOn(false);
      setMode('idle');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addLog, setStreamingEnabled]);
  // Transcription display disabled for now
  // const [toolLabel, setToolLabel] = useState<string>('');
  type Mode = 'idle' | 'speaking' | 'thinking';
  const [mode, setMode] = useState<Mode>('idle');
  const speakTimerRef = useRef<number | null>(null);
  const reportToolPendingRef = useRef<boolean>(false);
  const disconnectRef = useRef<() => void>(() => {});
  const stopMicRef = useRef<() => void>(() => {});
  const connectRef = useRef<() => void>(() => {});
  const startMicRef = useRef<() => Promise<void>>(async () => {});
  const manualDisconnectRef = useRef<boolean>(false);
  const shouldAutoReconnectRef = useRef<boolean>(true);
  const reconnectAttemptsRef = useRef<number>(0);
  const reconnectTimerRef = useRef<number | null>(null);
  const toolSoundRef = useRef<HTMLAudioElement | null>(null);
  const toolLoopingRef = useRef<boolean>(false);
  const toolCallActiveRef = useRef<boolean>(false);
  const hasIngestedRef = useRef<boolean>(false);
  const thinkingTimeoutRef = useRef<number | null>(null);
  const lastAudioAtRef = useRef<number>(0);

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

  

  type WireMessage = { event?: string; name?: string; turn_complete?: unknown; interrupted?: unknown; mime_type?: string; data?: unknown };
  const onWsMessage = useCallback((data: unknown) => {
    const msg = data as WireMessage;
    if (msg?.event) {
      // Handle function call/response indicators
      const name: string = (msg?.name || '') as string;
      const lower = name.toLowerCase();
      // New report tool identifier
      const isReportTool = lower.includes('reportsynthesizer');
      if (msg.event === 'function_call') {
        turnIdRef.current += 1;
        setMode('thinking');
        // Pause upstream audio during tool calls (keep mic hardware on)
        try { setStreamingEnabled(false); } catch {}
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
        // If this was the ReportSynthesizer, mark pending and wait for turn control before closing
        if (isReportTool) {
          reportToolPendingRef.current = true;
          // Stop tool sound loop for report tool; we're navigating away shortly
          toolCallActiveRef.current = false;
          stopToolSoundLoop();
          clearThinkingTimeout();
        } else {
          // Resume upstream if not waiting for report tool
          try { setStreamingEnabled(true); } catch {}
          // Flush any buffered mic frames after a non-report tool finishes
          try {
            if (isOnline && wsStatusRef.current === WsStatus.Connected && micBacklogRef.current.length > 0) {
              const frames = micBacklogRef.current.splice(0, micBacklogRef.current.length);
              for (const f of frames) sendMessageRef.current({ mime_type: 'audio/pcm', data: f });
              addLog(LogLevel.Audio, `Flushed ${frames.length} buffered mic frames (post-tool)`);
            }
          } catch {}
          // Keep loop running for non-report tools until we actually get audio or turn control
        }
        // If the model is (or was just) speaking, prefer speaking; otherwise idle
        if (speakTimerRef.current) {
          setMode('speaking');
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
      // End any tool sound loop if still active
      if (toolCallActiveRef.current || toolLoopingRef.current) {
        toolCallActiveRef.current = false;
        stopToolSoundLoop();
      }
      // clear any previous tool indicator
      // If report tool just finished, ingest memory and go back to list with clientId
      if (reportToolPendingRef.current) {
        reportToolPendingRef.current = false;
        // Navigating away after report completion; do not auto-reconnect
        shouldAutoReconnectRef.current = false;
        try { disconnectRef.current(); } catch {}
        try { stopMicRef.current(); } catch {}
        try { setStreamingEnabled(false); } catch {}
        setIsMicOn(false);
        setMode('idle');
        // Fire-and-forget ingest; use keepalive in client to survive navigation
        if (!hasIngestedRef.current) {
          hasIngestedRef.current = true;
          try { void apiRef.current.ingestSessionMemory(false); } catch {}
        }
        router.replace(clientIdParam ? `/session?clientId=${clientIdParam}` : '/session');
        return;
      }
      // Otherwise resume upstream
      try { setStreamingEnabled(true); } catch {}
      // Flush any buffered mic frames now that we have turn control back
      try {
        if (isOnline && wsStatusRef.current === WsStatus.Connected && micBacklogRef.current.length > 0) {
          const frames = micBacklogRef.current.splice(0, micBacklogRef.current.length);
          for (const f of frames) sendMessageRef.current({ mime_type: 'audio/pcm', data: f });
          addLog(LogLevel.Audio, `Flushed ${frames.length} buffered mic frames (post-turn)`);
        }
      } catch {}
      // Prefer speaking if audio frames arrived very recently, else idle
      if (speakTimerRef.current) {
        setMode('speaking');
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
        lastAudioAtRef.current = Date.now();
        playAudioChunk(msg.data as string);
        setMode('speaking');
        if (speakTimerRef.current) window.clearTimeout(speakTimerRef.current);
        speakTimerRef.current = window.setTimeout(() => setMode('idle'), 2500);
        return;
      }
    }
    // Do not log unhandled messages
    // addLog(LogLevel.Ws, 'Received unhandled message', data);
  }, [addLog, playAudioChunk, setStreamingEnabled, router, clientIdParam, disconnectRef, stopMicRef, clearThinkingTimeout, startToolSoundLoop, stopToolSoundLoop, isOnline]);
  const onWsClose = useCallback((code?: number, reason?: string) => {
    addLog(LogLevel.Ws, 'WebSocket disconnected', { code, reason });
    // Always release microphone hardware and reset streaming gate on close
    stopMic();
    // Ensure any tool sound loop is stopped on close
    toolCallActiveRef.current = false;
    stopToolSoundLoop();
    clearThinkingTimeout();
    setStreamingEnabled(false);
    setIsMicOn(false);
    setMode('idle');
    // Clear any speaking timers and playback queue to avoid replay on reconnect
    try { if (speakTimerRef.current) { window.clearTimeout(speakTimerRef.current); speakTimerRef.current = null; } } catch {}
    try { clearPlaybackQueue(); } catch {}
    // Drop any buffered mic frames on hard disconnect (optional; we keep until next connect)
    // Auto-reconnect with backoff if not manual and allowed
    try { if (reconnectTimerRef.current != null) { window.clearTimeout(reconnectTimerRef.current); reconnectTimerRef.current = null; } } catch {}
    if (shouldAutoReconnectRef.current && !manualDisconnectRef.current) {
      const attempt = reconnectAttemptsRef.current;
      const delay = Math.min(5000, 1000 * Math.pow(2, attempt));
      reconnectTimerRef.current = window.setTimeout(async () => {
        try {
          setIsConnecting(true);
          await startMicRef.current();
          connectRef.current();
          reconnectAttemptsRef.current = 0;
        } catch (err) {
          reconnectAttemptsRef.current = attempt + 1;
          addLog(LogLevel.Error, 'Auto-reconnect attempt failed', err);
        }
      }, delay);
    }
  }, [addLog, stopMic, setStreamingEnabled]);
  const onWsError = useCallback((event?: Event) => addLog(LogLevel.Error, 'WebSocket error', event), [addLog]);
  const { connect, disconnect, sendMessage, status: wsStatus } = useWebSocket(wsUrl, () => onWsOpenRef.current(), onWsMessage, onWsClose, onWsError);
  // Keep status in a ref for early consumers
  React.useEffect(() => { wsStatusRef.current = wsStatus; }, [wsStatus]);
  const api = useApiClient(config, addLog);
  const apiRef = useRef(api);
  React.useEffect(() => { apiRef.current = api; }, [api]);

  // Keep imperative refs in sync with latest functions
  React.useEffect(() => { stopMicRef.current = stopMic; }, [stopMic]);
  React.useEffect(() => { disconnectRef.current = disconnect; }, [disconnect]);
  React.useEffect(() => { connectRef.current = connect; }, [connect]);
  React.useEffect(() => { startMicRef.current = startMic; }, [startMic]);
  React.useEffect(() => () => { try { if (reconnectTimerRef.current != null) window.clearTimeout(reconnectTimerRef.current); } catch {} }, []);

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

  // Events text removed; visual handled by IAdvisor

  // Reset local loading flags on status changes
  React.useEffect(() => {
    if (wsStatus !== WsStatus.Connecting) setIsConnecting(false);
    if (wsStatus === WsStatus.Disconnected) setIsDisconnecting(false);
  }, [wsStatus]);

  // UI status pill meta for header
  const statusMeta = React.useMemo(() => {
    const modeSuffix = ((): string => {
      if (!isOnline) return '';
      if (wsStatus !== WsStatus.Connected) return '';
      if (mode === 'thinking') return ' • En réflexion';
      if (mode === 'speaking') return ' • Réponse';
      return '';
    })();
    if (!isOnline) return { text: 'Hors ligne', classes: 'bg-red-100 text-red-700 border border-red-200' };
    if (wsStatus === WsStatus.Connected) return { text: `Connecté${modeSuffix}`.trim(), classes: 'bg-emerald-100 text-emerald-700 border border-emerald-200' };
    if (wsStatus === WsStatus.Connecting || isConnecting) return { text: 'Connexion…', classes: 'bg-amber-100 text-amber-700 border border-amber-200' };
    if (wsStatus === WsStatus.Error) return { text: 'Erreur', classes: 'bg-red-100 text-red-700 border border-red-200' };
    return { text: 'Déconnecté', classes: 'bg-gray-100 text-gray-700 border border-gray-200' };
  }, [wsStatus, isConnecting, isOnline, mode]);

  const advisorMode: IAdvisorMode = React.useMemo(() => {
    if (!isOnline) return 'disconnected';
    if (wsStatus === WsStatus.Connecting || isConnecting) return 'connecting';
    if (wsStatus === WsStatus.Error || wsStatus === WsStatus.Disconnected) return 'disconnected';
    // Connected
    if (mode === 'thinking') return 'thinking';
    if (mode === 'speaking') return 'responding';
    return 'idle';
  }, [isOnline, wsStatus, isConnecting, mode]);

  const advisorDisabled = !isOnline || wsStatus !== WsStatus.Connected;

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
                {isOnline && wsStatus !== WsStatus.Connected && (
                  <div className="w-full text-sm px-3 py-2 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                    {wsStatus === WsStatus.Connecting || isConnecting ? 'Connexion en cours…' : 'Non connecté au serveur.'}
                  </div>
                )}
                <div className="flex-1 overflow-auto bg-background border rounded-md p-4 flex items-center justify-center">
                  <IAdvisor
                    active={isMicOn}
                    onToggle={advisorDisabled ? undefined : () => {
                      if (!isMicOn) {
                        setStreamingEnabled(true);
                        setIsMicOn(true);
                        setMode('idle');
                      } else {
                        setStreamingEnabled(false);
                        setIsMicOn(false);
                        setMode('idle');
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
                      await startMic();
                      connect();
                    } catch (err) {
                      setIsConnecting(false);
                      addLog(LogLevel.Error, 'Failed to connect', err);
                    }
                  }}
                  variant={(!isOnline || wsStatus === WsStatus.Connected || wsStatus === WsStatus.Connecting) ? 'secondary' : 'default'}
                  disabled={!isOnline || wsStatus === WsStatus.Connected || wsStatus === WsStatus.Connecting || isConnecting}
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
                    disconnect();
                    stopMic();
                    setStreamingEnabled(false);
                    setIsMicOn(false);
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

