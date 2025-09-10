"use client";
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
// removed Loader2-based status row in events panel
import IAdvisor from '@/components/kokonutui/IAdvisor';
import type { Config, LogEntry } from '@/lib/types';
import { LogLevel, WsStatus } from '@/lib/types';
import { useLocalStorage, useWebSocket, useAudioProcessor } from '@/lib/hooks';
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

  // Bridge sendMessage to audio hook without TDZ issues
  const sendMessageRef = useRef<(data: unknown) => void>(() => {});
  const onMicData = useCallback((base64: string) => {
    sendMessageRef.current({ mime_type: 'audio/pcm', data: base64 });
  }, []);
  const [rms01, setRms01] = useState(0);
  const { startMic, stopMic, playAudioChunk, clearPlaybackQueue, setStreamingEnabled } = useAudioProcessor(onMicData, addLog, (lvl) => setRms01(lvl));
  React.useEffect(() => {
    onWsOpenRef.current = () => {
      addLog(LogLevel.Ws, 'WebSocket connected.');
      try { setStreamingEnabled(true); } catch {}
      setIsMicOn(true);
      setMode('idle');
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

  type WireMessage = { event?: string; name?: string; turn_complete?: unknown; interrupted?: unknown; mime_type?: string; data?: unknown };
  const onWsMessage = useCallback((data: unknown) => {
    const msg = data as WireMessage;
    if (msg?.event) {
      // Handle function call/response indicators
      const name: string = (msg?.name || '') as string;
      const lower = name.toLowerCase();
      const isReportTool = lower.includes('resport') || lower.includes('report');
      if (msg.event === 'function_call') {
        setMode('thinking');
        // Pause upstream audio during tool calls (keep mic hardware on)
        try { setStreamingEnabled(false); } catch {}
        // Do NOT set the pending flag yet; wait for the function_response to confirm the tool finished
      } else if (msg.event === 'function_response') {
        // If this was the report synthesizer, mark pending and wait for turn control before closing
        if (isReportTool) {
          reportToolPendingRef.current = true;
        } else {
          // Resume upstream if not waiting for report tool
          try { setStreamingEnabled(true); } catch {}
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
        clearPlaybackQueue();
      }
      // clear any previous tool indicator
      // If report tool just finished, stop and go back to list with clientId
      if (reportToolPendingRef.current) {
        reportToolPendingRef.current = false;
        // Navigating away after report completion; do not auto-reconnect
        shouldAutoReconnectRef.current = false;
        try { disconnectRef.current(); } catch {}
        try { stopMicRef.current(); } catch {}
        try { setStreamingEnabled(false); } catch {}
        setIsMicOn(false);
        setMode('idle');
        router.replace(clientIdParam ? `/session?clientId=${clientIdParam}` : '/session');
        return;
      }
      // Otherwise resume upstream
      try { setStreamingEnabled(true); } catch {}
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
        playAudioChunk(msg.data as string);
        setMode('speaking');
        if (speakTimerRef.current) window.clearTimeout(speakTimerRef.current);
        speakTimerRef.current = window.setTimeout(() => setMode('idle'), 2500);
        return;
      }
    }
    // Do not log unhandled messages
    // addLog(LogLevel.Ws, 'Received unhandled message', data);
  }, [addLog, playAudioChunk, clearPlaybackQueue, setStreamingEnabled, router, clientIdParam, disconnectRef, stopMicRef]);
  const onWsClose = useCallback((code?: number, reason?: string) => {
    addLog(LogLevel.Ws, 'WebSocket disconnected', { code, reason });
    // Always release microphone hardware and reset streaming gate on close
    stopMic();
    setStreamingEnabled(false);
    setIsMicOn(false);
    setMode('idle');
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

  // Keep imperative refs in sync with latest functions
  React.useEffect(() => { stopMicRef.current = stopMic; }, [stopMic]);
  React.useEffect(() => { disconnectRef.current = disconnect; }, [disconnect]);
  React.useEffect(() => { connectRef.current = connect; }, [connect]);
  React.useEffect(() => { startMicRef.current = startMic; }, [startMic]);
  React.useEffect(() => () => { try { if (reconnectTimerRef.current != null) window.clearTimeout(reconnectTimerRef.current); } catch {} }, []);

  // Keep ref in sync once hook returns sendMessage
  React.useEffect(() => {
    sendMessageRef.current = (data: unknown) => sendMessage(data);
  }, [sendMessage]);

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
    if (wsStatus === WsStatus.Connected) return { text: 'Connecté', classes: 'bg-emerald-100 text-emerald-700 border border-emerald-200' };
    if (wsStatus === WsStatus.Connecting || isConnecting) return { text: 'Connexion…', classes: 'bg-amber-100 text-amber-700 border border-amber-200' };
    if (wsStatus === WsStatus.Error) return { text: 'Erreur', classes: 'bg-red-100 text-red-700 border border-red-200' };
    return { text: 'Déconnecté', classes: 'bg-gray-100 text-gray-700 border border-gray-200' };
  }, [wsStatus, isConnecting]);

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
                <div className="flex-1 overflow-auto bg-background border rounded-md p-4 flex items-center justify-center">
                  <IAdvisor
                    active={isMicOn}
                    onToggle={() => {
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
                    rmsLevel01={rms01}
                    wsMode={mode === 'thinking' ? 'thinking' : (mode === 'speaking' ? 'responding' : 'idle')}
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
                  variant={(wsStatus === WsStatus.Connected || wsStatus === WsStatus.Connecting) ? 'secondary' : 'default'}
                  disabled={wsStatus === WsStatus.Connected || wsStatus === WsStatus.Connecting || isConnecting}
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
                  disabled={wsStatus !== WsStatus.Connected || isDisconnecting}
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

