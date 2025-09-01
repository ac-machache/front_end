"use client";
import React, { useMemo, useRef, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import type { Config, LogEntry, Session } from '@/lib/types';
import { LogLevel } from '@/lib/types';
import { useLocalStorage, useApiClient, useWebSocket, useAudioProcessor } from '@/lib/hooks';
import { buildWsUrl } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type Page = 'config' | 'list' | 'detail';

export default function Home() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<Page>('config');
  const [config, setConfig] = useLocalStorage<Config>('app-config', { scheme: 'ws', host: 'localhost', port: '8080', appName: 'app', userId: 'user', sessionId: '' });
  const [environment, setEnvironment] = useLocalStorage<'local' | 'cloud'>('app-environment', 'local');
  const [apiResult, setApiResult] = useState<any>(null);
  const [apiResultTitle, setApiResultTitle] = useState('API Result');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMicOn, setIsMicOn] = useState(false);
  const logCounter = useRef(0);

  const addLog = useCallback((level: LogLevel, message: string, data?: any) => {
    setLogs(prev => [...prev, { id: logCounter.current++, level, message, data, timestamp: new Date().toLocaleTimeString() }]);
  }, []);

  const wsUrl = useMemo(() => buildWsUrl(config), [config]);
  const apiClient = useApiClient(config, addLog);

  const handleApiResponse = (title: string, data: any) => {
    if (!data) return;
    setApiResultTitle(title);
    setApiResult(data);
    if (title.startsWith('Create Session') && data.id) setConfig(prev => ({ ...prev, sessionId: data.id }));
  };

  const onWsOpen = useCallback(() => addLog(LogLevel.Ws, 'WebSocket connected.'), [addLog]);

  // Bridge sendMessage into audio hook without TDZ
  const sendMessageRef = useRef<(data: any) => void>(() => {});
  const onMicData = useCallback((base64: string) => {
    sendMessageRef.current({ mime_type: 'audio/pcm', data: base64 });
  }, []);
  const { startMic, stopMic, playAudioChunk, clearPlaybackQueue } = useAudioProcessor(onMicData, addLog);

  const onWsMessage = useCallback((data: any) => {
    if (data?.event) {
      addLog(LogLevel.Event, data.event, data.data);
      return;
    }
    if (data?.turn_complete !== undefined || data?.interrupted !== undefined) {
      addLog(LogLevel.Event, 'Turn Control', data);
      if (data?.interrupted) clearPlaybackQueue();
      return;
    }
    if (data?.mime_type && data?.data) {
      if (data.mime_type.startsWith('audio/')) {
        playAudioChunk(data.data);
        return;
      }
    }
    addLog(LogLevel.Ws, 'Received unhandled message', data);
  }, [addLog, playAudioChunk, clearPlaybackQueue]);

  const onWsClose = useCallback((code?: number, reason?: string) => {
    addLog(LogLevel.Ws, 'WebSocket disconnected', { code, reason });
    if (isMicOn) { stopMic(); setIsMicOn(false); }
  }, [addLog, isMicOn, stopMic]);
  const onWsError = useCallback((event?: Event) => addLog(LogLevel.Error, 'WebSocket error', event), [addLog]);
  const { connect, disconnect, sendMessage, status: wsStatus } = useWebSocket(wsUrl, onWsOpen, onWsMessage, onWsClose, onWsError);
  React.useEffect(() => { sendMessageRef.current = (data: any) => sendMessage(data); }, [sendMessage]);

  const handleGoToSession = (sessionId: string) => {
    setConfig(prev => ({ ...prev, sessionId }));
    setApiResult(null);
    router.push(`/session/${sessionId}`);
  };

  const create = async (fields: { nom_tc?: string; nom_agri?: string }) => {
    const result = await apiClient.createSession({ nom_tc: fields.nom_tc || '', nom_agri: fields.nom_agri || '' }) as Session | null;
    handleApiResponse('Create Session (Auto-ID)', result);
    if (result?.id) handleGoToSession(result.id);
  };

  const formatTs = (ts?: string) => {
    if (!ts) return 'N/A';
    const n = typeof ts === 'string' ? parseFloat(ts) : Number(ts);
    if (!isFinite(n)) return ts;
    const d = new Date(n * 1000);
    return d.toLocaleString();
  };

  // Keep config in sync with environment selection
  React.useEffect(() => {
    setConfig(prev => {
      if (environment === 'local') {
        // For local, we don't need host/port as we use the proxy.
        // Set sane defaults, but they won't be used for the URL.
        const next = { ...prev, scheme: 'ws' as const, host: 'localhost', port: '8080', appName: 'app' };
        return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
      }
      // For cloud, set a default port but allow user to override host.
      const next = { ...prev, scheme: 'wss' as const, port: '443', appName: 'app' };
      return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
    });
  }, [environment, setConfig]);

  if (currentPage === 'config') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">IAdvisor</h1>
          <p className="text-muted-foreground mt-2">Veuillez Choisir un agri .</p>
        </div>
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="environment">Environment</Label>
                  <select id="environment" name="environment" value={environment} onChange={(e) => setEnvironment(e.target.value as 'local' | 'cloud')} className="mt-1 block w-full bg-background border border-input rounded-md px-3 py-2 text-sm">
                    <option value="local">Local (Proxied)</option>
                    <option value="cloud">Cloud Run</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="userId">User ID</Label>
                  <Input id="userId" value={config.userId} onChange={(e) => setConfig(prev => ({ ...prev, userId: e.target.value }))} className="mt-1" />
                </div>
              </div>
              {environment === 'cloud' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cloudHost">Cloud Run Host</Label>
                    <Input id="cloudHost" placeholder="your-service-xxxx-xx.run.app" value={config.host} onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="cloudPort">Port</Label>
                    <Input id="cloudPort" value={config.port} onChange={(e) => setConfig(prev => ({ ...prev, port: e.target.value }))} className="mt-1" />
                  </div>
                </div>
              )}
              <Button className="w-full" onClick={() => setCurrentPage('list')}>Connect</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Audio Service Tester</h1>
          <p className="text-muted-foreground">{currentPage === 'list' ? 'Manage your sessions.' : `Interacting with Session: ${config.sessionId}`}</p>
        </div>
        <Button variant="secondary" onClick={() => setCurrentPage('config')}>Change Configuration</Button>
      </div>
      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-12 md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label>Nom TC</Label>
                  <Input id="nom_tc" placeholder="e.g. Jean Dupont" className="mt-1" onChange={(e) => (window as any)._nom_tc = e.target.value} />
                </div>
                <div>
                  <Label>Nom Agri</Label>
                  <Input id="nom_agri" placeholder="e.g. Marie Martin" className="mt-1" onChange={(e) => (window as any)._nom_agri = e.target.value} />
                </div>
                <Button className="w-full" onClick={() => create({ nom_tc: (window as any)._nom_tc, nom_agri: (window as any)._nom_agri })}>Create</Button>
                <Button className="w-full" onClick={async () => handleApiResponse('Session List', await apiClient.listSessions())}>List Sessions</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-12 md:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>{apiResultTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(apiResult) ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session ID</TableHead>
                      <TableHead>Last Update Time</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiResult.map((s: any) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-mono">{s.id}</TableCell>
                        <TableCell className="font-mono">{formatTs(s.lastUpdateTime)}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="secondary" onClick={() => handleGoToSession(s.id)}>Select</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <pre className="text-sm whitespace-pre-wrap break-all">{apiResult ? JSON.stringify(apiResult, null, 2) : 'No data to display.'}</pre>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
