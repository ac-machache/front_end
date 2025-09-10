"use client";
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import AIVoice from '@/components/kokonutui/ai-voice';
// removed Loader2-based status row in events panel
import AITextLoading from '@/components/kokonutui/ai-text-loading';
import type { Config, LogEntry } from '@/lib/types';
import { LogLevel, WsStatus } from '@/lib/types';
import { useLocalStorage, useWebSocket, useAudioProcessor } from '@/lib/hooks';
import { buildWsUrl } from '@/lib/utils';

export default function SessionDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [config, setConfig] = useLocalStorage<Config>('app-config', { scheme: 'wss', host: 'localhost', port: '443', appName: 'app', userId: 'user', sessionId: '' });
  const [, setLogs] = useState<LogEntry[]>([]);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const logCounter = useRef(0);

  // Ensure sessionId matches URL
  React.useEffect(() => {
    const id = params?.id as string;
    if (id && config.sessionId !== id) setConfig(prev => ({ ...prev, sessionId: id }));
  }, [params?.id, config.sessionId, setConfig]);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  const addLog = useCallback((level: LogLevel, message: string, data?: unknown) => {
    setLogs(prev => [...prev, { id: logCounter.current++, level, message, data, timestamp: new Date().toLocaleTimeString() }]);
  }, []);

  const wsUrl = useMemo(() => buildWsUrl(config), [config]);
  // No HTTP calls here; realtime over WebSocket only

  const onWsOpen = useCallback(() => addLog(LogLevel.Ws, 'WebSocket connected.'), [addLog]);

  // Bridge sendMessage to audio hook without TDZ issues
  const sendMessageRef = useRef<(data: unknown) => void>(() => {});
  const onMicData = useCallback((base64: string) => {
    sendMessageRef.current({ mime_type: 'audio/pcm', data: base64 });
  }, []);
  const { startMic, stopMic, playAudioChunk, clearPlaybackQueue, setStreamingEnabled } = useAudioProcessor(onMicData, addLog);
  // Transcription display disabled for now
  const [toolLabel, setToolLabel] = useState<string>('');
  type Mode = 'idle' | 'speaking' | 'thinking';
  const [mode, setMode] = useState<Mode>('idle');
  const speakTimerRef = useRef<number | null>(null);

  type WireMessage = { event?: string; name?: string; turn_complete?: unknown; interrupted?: unknown; mime_type?: string; data?: unknown };
  const onWsMessage = useCallback((data: unknown) => {
    const msg = data as WireMessage;
    if (msg?.event) {
      // Handle function call/response indicators
      const name: string = (msg?.name || '') as string;
      const lower = name.toLowerCase();
      const labelFor = (toolLower: string, original: string) => {
        if (toolLower.includes('topicclarifier')) return 'Réflexion en cours…';
        if (toolLower.includes('report')) return 'Génération du rapport…';
        if (toolLower.includes('memorymanager')) return 'Mise à jour de la mémoire…';
        if (toolLower.includes('search_memories')) return 'Recherche en mémoire…';
        return `Appel d’outil: ${original || 'inconnu'}`;
      };
      if (msg.event === 'function_call') {
        const label = labelFor(lower, name);
        setToolLabel(label);
        setMode('thinking');
      } else if (msg.event === 'function_response') {
        // Clear indicator when a tool finishes and revert to baseline
        setToolLabel('');
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
      setToolLabel('');
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
  }, [addLog, playAudioChunk, clearPlaybackQueue]);
  const onWsClose = useCallback((code?: number, reason?: string) => {
    addLog(LogLevel.Ws, 'WebSocket disconnected', { code, reason });
    // Always release microphone hardware and reset streaming gate on close
    stopMic();
    setStreamingEnabled(false);
    setIsMicOn(false);
    setMode('idle');
  }, [addLog, stopMic, setStreamingEnabled]);
  const onWsError = useCallback((event?: Event) => addLog(LogLevel.Error, 'WebSocket error', event), [addLog]);
  const { connect, disconnect, sendMessage, status: wsStatus } = useWebSocket(wsUrl, onWsOpen, onWsMessage, onWsClose, onWsError);

  // Keep ref in sync once hook returns sendMessage
  React.useEffect(() => {
    sendMessageRef.current = (data: unknown) => sendMessage(data);
  }, [sendMessage]);

  // Manual connect only via UI controls to avoid auto-reconnect behavior
  React.useEffect(() => {
    setMode('idle');
  }, [isMicOn]);

  // Derive a single source of truth for the events display
  const getEventTexts = (): string[] => {
    // Connection state takes precedence
    if (wsStatus === WsStatus.Connecting) return ['Connexion…'];
    if (wsStatus === WsStatus.Disconnected) return ['Déconnecté'];
    if (wsStatus === WsStatus.Error) return ['Erreur de connexion'];
    // When connected, show by mode
    if (mode === 'thinking') return [toolLabel || 'Réflexion en cours…'];
    if (mode === 'speaking') return ['Synthèse de parole…'];
    // no dedicated listening state anymore
    return ['En attente'];
  };

  // Reset local loading flags on status changes
  React.useEffect(() => {
    if (wsStatus !== WsStatus.Connecting) setIsConnecting(false);
    if (wsStatus === WsStatus.Disconnected) setIsDisconnecting(false);
  }, [wsStatus]);

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto p-4">
      <div className="flex-shrink-0 flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Session {isHydrated ? (config.sessionId || (params?.id as string) || '') : ''}</h1>
          <p className="text-muted-foreground">Connexion et dictée audio en temps réel.</p>
        </div>
        <Button variant="secondary" onClick={() => router.replace('/session')}>Retour aux sessions</Button>
      </div>

      <div className="flex-grow overflow-hidden">
        <div className="grid grid-cols-5 gap-4 h-full">
          <div className="col-span-5 h-full">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Événements</CardTitle>
              </CardHeader>
              <CardContent className="overflow-hidden h-[calc(100%-3rem)] flex flex-col gap-4">
                {/* Events panel now only uses AITextLoading */}
                <div className="flex-1 overflow-auto bg-background border rounded-md p-4">
                  <AITextLoading texts={getEventTexts()} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-4">
        {/* Left: Micro panel (same width as Events) */}
        <div className="col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Micro</CardTitle>
            </CardHeader>
            <CardContent>
              <AIVoice
                active={isMicOn}
                onToggle={(next) => {
                  if (next) {
                    // Turn on streaming to backend, keep mic device untouched
                    setStreamingEnabled(true);
                    setIsMicOn(true);
                    setMode('idle');
                  } else {
                    // Pause upstream without stopping microphone hardware
                    setStreamingEnabled(false);
                    setIsMicOn(false);
                    setMode('idle');
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>
        {/* Right: Connection panel (same width as Logs) */}
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Connexion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={async () => {
                    // Start mic hardware on Connect; streaming remains gated by mic button
                    setIsConnecting(true);
                    try {
                      await startMic();
                      connect();
                    } catch (err) {
                      setIsConnecting(false);
                      addLog(LogLevel.Error, 'Failed to connect', err);
                    }
                  }}
                  className="w-full"
                  variant={(wsStatus === WsStatus.Connected || wsStatus === WsStatus.Connecting) ? 'secondary' : 'default'}
                  disabled={wsStatus === WsStatus.Connected || wsStatus === WsStatus.Connecting || isConnecting}
                >
                  {(isConnecting || wsStatus === WsStatus.Connecting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {(isConnecting || wsStatus === WsStatus.Connecting) ? 'Connexion…' : 'Connecter'}
                </Button>
                <Button
                  onClick={() => {
                    // Release mic hardware cleanly on Disconnect
                    setIsDisconnecting(true);
                    disconnect();
                    stopMic();
                    setStreamingEnabled(false);
                    setIsMicOn(false);
                    setMode('idle');
                  }}
                  className="w-full"
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

