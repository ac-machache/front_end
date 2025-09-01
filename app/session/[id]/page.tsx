"use client";
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  const [micLevel, setMicLevel] = useState(0);
  const { startMic, stopMic, playAudioChunk, clearPlaybackQueue } = useAudioProcessor(onMicData, addLog, (lvl) => setMicLevel(lvl));
  const [prompterLine, setPrompterLine] = useState<string>('');

  const onWsMessage = useCallback((data: any) => {
    if (data?.event) {
      addLog(LogLevel.Event, data.event, data.data);
      return;
    }
    if (data?.turn_complete !== undefined || data?.interrupted !== undefined) {
      addLog(LogLevel.Event, 'Turn Control', data);
      if (data?.interrupted) {
        clearPlaybackQueue();
      }
      return;
    }
    if (data?.mime_type && data?.data) {
      if (data.mime_type.startsWith('audio/')) {
        playAudioChunk(data.data);
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
          <p className="text-muted-foreground">Connect and stream audio in real-time.</p>
        </div>
        <Button variant="secondary" onClick={() => router.replace('/?page=list')}>Back to Sessions</Button>
      </div>

      <div className="flex-grow overflow-hidden">
        <div className="grid grid-cols-5 gap-4 h-full">
          <div className="col-span-4 h-full">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Interesting Events</CardTitle>
              </CardHeader>
              <CardContent className="overflow-hidden h-[calc(100%-3rem)] flex flex-col gap-4">
                {/* Mic waveform style bar */}
                <div className="h-24 bg-muted rounded-md flex items-end p-2">
                  <div
                    className="w-full bg-primary/80 transition-[height] duration-75 rounded-sm"
                    style={{ height: `${Math.max(4, micLevel * 100)}%` }}
                    aria-label="mic-level"
                  />
                </div>

                {/* TV prompter style current line */}
                <div className="flex-1 overflow-hidden bg-background border rounded-md p-4">
                  <div className="h-full w-full overflow-hidden">
                    <p className="text-2xl leading-relaxed tracking-wide font-medium whitespace-pre-wrap">
                      {prompterLine || 'Awaiting transcription...'}
                    </p>
                  </div>
                </div>

                {/* Placeholder actions for demo: update prompter */}
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setPrompterLine('Bonjour Sarah, voici la synthèse en cours...')}>Mock Line 1</Button>
                  <Button size="sm" variant="secondary" onClick={() => setPrompterLine('Le modèle réfléchit: opportunité engrais azoté, prix sensible...')}>Mock Line 2</Button>
                  <Button size="sm" variant="secondary" onClick={() => setPrompterLine('Conclusion: plan d’action envoyé; suivi sous 15 jours.')}>Mock Line 3</Button>
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

