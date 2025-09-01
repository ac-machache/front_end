"use client";
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { Config, LogEntry } from '@/lib/types';
import { LogLevel, WsStatus } from '@/lib/types';
import { useLocalStorage, useApiClient, useWebSocket, useAudioProcessor } from '@/lib/hooks';
import { buildWsUrl } from '@/lib/utils';

export default function SessionDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [config, setConfig] = useLocalStorage<Config>('app-config', { scheme: 'wss', host: 'localhost', port: '443', appName: 'app', userId: 'user', sessionId: '' });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMicOn, setIsMicOn] = useState(false);
  const logCounter = useRef(0);

  // Ensure sessionId matches URL
  React.useEffect(() => {
    const id = params?.id as string;
    if (id && config.sessionId !== id) setConfig(prev => ({ ...prev, sessionId: id }));
  }, [params?.id]);

  const addLog = useCallback((level: LogLevel, message: string, data?: any) => {
    setLogs(prev => [...prev, { id: logCounter.current++, level, message, data, timestamp: new Date().toLocaleTimeString() }]);
  }, []);

  const wsUrl = useMemo(() => buildWsUrl(config), [config]);
  const apiClient = useApiClient(config, addLog);

  const onWsOpen = useCallback(() => addLog(LogLevel.Ws, 'WebSocket connected.'), [addLog]);

  // Bridge sendMessage to audio hook without TDZ issues
  const sendMessageRef = useRef<(data: any) => void>(() => {});
  const onMicData = useCallback((base64: string) => {
    sendMessageRef.current({ mime_type: 'audio/pcm', data: base64 });
  }, []);
  const { startMic, stopMic, playAudioChunk, clearPlaybackQueue } = useAudioProcessor(onMicData, addLog);
  const [prompterLine, setPrompterLine] = useState<string>('');
  const [toolLabel, setToolLabel] = useState<string>('');

  const onWsMessage = useCallback((data: any) => {
    if (data?.event) {
      // Handle function call/response indicators
      const name: string = (data?.name || '') as string;
      const lower = name.toLowerCase();
      if (data.event === 'function_call') {
        if (lower.includes('topicclarifier')) setToolLabel('Thinking…');
        else if (lower.includes('resport') || lower.includes('reportsynth') || lower.includes('report')) setToolLabel('Generating report…');
        else if (lower.includes('memorymanager')) setToolLabel('Updating memory…');
        else if (lower.includes('search_memories')) {
          // ignore surface indicator for search_memories
        }
      } else if (data.event === 'function_response') {
        // Clear indicator when a tool finishes
        setToolLabel('');
      }
      addLog(LogLevel.Event, data.event, data.name || data.data);
      return;
    }
    if (data?.turn_complete !== undefined || data?.interrupted !== undefined) {
      addLog(LogLevel.Event, 'Turn Control', data);
      if (data?.interrupted) {
        clearPlaybackQueue();
      }
      setToolLabel('');
      return;
    }
    if (data?.mime_type && data?.data) {
      if (data.mime_type.startsWith('audio/')) {
        playAudioChunk(data.data);
        return;
      }
      if (typeof data.data === 'string' && data.mime_type === 'text/plain') {
        // Only show model text/plain (partials replace)
        setPrompterLine(data.data);
        return;
      }
    }
    // Do not log unhandled messages
    // addLog(LogLevel.Ws, 'Received unhandled message', data);
  }, [addLog, playAudioChunk, clearPlaybackQueue]);
  const onWsClose = useCallback((code?: number, reason?: string) => {
    addLog(LogLevel.Ws, 'WebSocket disconnected', { code, reason });
    if (isMicOn) { stopMic(); setIsMicOn(false); }
  }, [addLog, isMicOn, stopMic]);
  const onWsError = useCallback((event?: Event) => addLog(LogLevel.Error, 'WebSocket error', event), [addLog]);
  const { connect, disconnect, sendMessage, status: wsStatus } = useWebSocket(wsUrl, onWsOpen, onWsMessage, onWsClose, onWsError);

  // Keep ref in sync once hook returns sendMessage
  React.useEffect(() => {
    sendMessageRef.current = (data: any) => sendMessage(data);
  }, [sendMessage]);

  // Manual connect only via UI controls to avoid auto-reconnect behavior

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto p-4">
      <div className="flex-shrink-0 flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Session {config.sessionId}</h1>
          <p className="text-muted-foreground">Connexion et dictée audio en temps réel.</p>
        </div>
        <Button variant="secondary" onClick={() => router.replace('/?page=list')}>Retour aux sessions</Button>
      </div>

      <div className="flex-grow overflow-hidden">
        <div className="grid grid-cols-5 gap-4 h-full">
          <div className="col-span-4 h-full">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Événements</CardTitle>
              </CardHeader>
              <CardContent className="overflow-hidden h-[calc(100%-3rem)] flex flex-col gap-4">
                {/* Tool status */}
                {toolLabel && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{toolLabel}</span>
                  </div>
                )}
                {/* TV prompter style current line */}
                <div className="flex-1 overflow-auto bg-background border rounded-md p-4">
                  <div className="h-full w-full overflow-hidden">
                    <p className="text-base md:text-lg leading-relaxed tracking-wide whitespace-pre-wrap">
                      {prompterLine || 'Awaiting transcription...'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-1 h-full">
            <Card className="h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle>Logs</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-auto">
                <div className="text-xs font-mono space-y-1 pr-2">
                  {logs.map(l => (
                    <div key={l.id} className="flex gap-2 items-start">
                      <span className="text-muted-foreground whitespace-nowrap">{l.timestamp}</span>
                      <span className="font-bold">[{l.level}]</span>
                      <span className="break-all whitespace-pre-wrap">{l.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Realtime Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                onClick={connect}
                variant={(wsStatus === WsStatus.Connected || wsStatus === WsStatus.Connecting) ? 'secondary' : 'default'}
                disabled={wsStatus === WsStatus.Connected || wsStatus === WsStatus.Connecting}
              >
                Connect
              </Button>
              <Button
                onClick={disconnect}
                variant={wsStatus === WsStatus.Connected ? 'default' : 'secondary'}
                disabled={wsStatus !== WsStatus.Connected}
              >
                Disconnect
              </Button>
              <Button onClick={() => { isMicOn ? (stopMic(), setIsMicOn(false)) : (startMic(), setIsMicOn(true)); }}>
                {isMicOn ? 'Stop Mic' : 'Start Mic'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

