"use client";
import React, { useMemo, useRef, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import type { Config, LogEntry, Session } from '@/lib/types';
import { LogLevel } from '@/lib/types';
import { useLocalStorage, useApiClient, useWebSocket, useAudioProcessor } from '@/lib/hooks';
import { buildWsUrl } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

type Page = 'config' | 'list' | 'detail';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState<Page>('config');
  const [config, setConfig] = useLocalStorage<Config>('app-config', { scheme: 'ws', host: 'localhost', port: '8080', appName: 'app', userId: 'user', sessionId: '' });
  const [environment, setEnvironment] = useLocalStorage<'local' | 'cloud'>('app-environment', 'local');
  const [apiResult, setApiResult] = useState<any>(null); // Sessions list or other API responses
  const [apiResultTitle, setApiResultTitle] = useState('Espace session');
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isListing, setIsListing] = useState(false);
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
    // Do not log unhandled messages
    // addLog(LogLevel.Ws, 'Received unhandled message', data);
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
    // Ensure browser back navigates to the list view instead of config
    router.push('/?page=list');
    setApiResult(null);
    router.push(`/session/${sessionId}`);
  };

  const create = async (fields: { nom_tc?: string; nom_agri?: string }) => {
    setIsCreating(true);
    try {
      const result = await apiClient.createSession({ nom_tc: fields.nom_tc || '', nom_agri: fields.nom_agri || '' }) as Session | null;
      handleApiResponse('Create Session (Auto-ID)', result);
      if (result?.id) {
        const updated = await apiClient.listSessions();
        handleApiResponse('Session List', updated);
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Select session: fetch details and display on the right panel (no navigation)
  const showSessionDetails = async (sessionId: string) => {
    setSelectedSession(null);
    setIsLoadingSession(true);
    try {
      const details = await apiClient.getSession(sessionId);
      setSelectedSession(details);
      setApiResultTitle('Session Details');
    } finally {
      setIsLoadingSession(false);
    }
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

  // Honor page query param so back button goes to list when expected
  React.useEffect(() => {
    const p = searchParams?.get('page');
    if (p === 'list') setCurrentPage('list');
  }, [searchParams]);

  if (currentPage === 'config') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">IAdvisor</h1>
          <p className="text-muted-foreground mt-2">Veuillez choisir un agriculteur.</p>
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
              <Button className="w-full" onClick={() => { setCurrentPage('list'); router.replace('/?page=list'); }}>Continuer</Button>
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
          <h1 className="text-2xl font-semibold">IAdvisor</h1>
          <p className="text-muted-foreground">{currentPage === 'list' ? 'Gérez vos sessions.' : `Session en cours : ${config.sessionId}`}</p>
        </div>
        <Button variant="secondary" onClick={() => setCurrentPage('config')}>Modifier la configuration</Button>
      </div>
      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-12 md:col-span-4 space-y-4">
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
                <Button className="w-full" disabled={isCreating} onClick={() => create({ nom_tc: (window as any)._nom_tc, nom_agri: (window as any)._nom_agri })}>
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isCreating ? 'Creating...' : 'Create'}
                </Button>
                <Button className="w-full" disabled={isListing} onClick={async () => {
                  setIsListing(true);
                  try {
                    const data = await apiClient.listSessions();
                    handleApiResponse('Session List', data);
                  } finally {
                    setIsListing(false);
                  }
                }}>
                  {isListing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isListing ? 'Listing...' : 'List Sessions'}
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.isArray(apiResult) && apiResult.length > 0 ? (
                  apiResult.map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                      <span className="font-mono text-sm truncate">{formatTs(s.lastUpdateTime) !== 'N/A' ? formatTs(s.lastUpdateTime) : s.id}</span>
                      <Button size="sm" variant="secondary" onClick={() => showSessionDetails(s.id)}>Select</Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No sessions loaded. Click "List Sessions".</p>
                )}
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
              {isLoadingSession && (
                <div className="text-sm text-muted-foreground">Chargement de la session…</div>
              )}
              {!isLoadingSession && !selectedSession && (
                <div className="text-sm text-muted-foreground">Sélectionnez une session pour afficher ses détails.</div>
              )}
              {!isLoadingSession && selectedSession && (
                <div className="space-y-4">
                  {selectedSession?.state?.RapportDeSortie ? (
                    <div className="space-y-6">
                      {/* Rapport principal */}
                      <div>
                        <h3 className="text-lg font-semibold">Rapport principal</h3>
                        <Separator className="my-2" />
                        <div className="space-y-1 text-sm">
                          <div><span className="font-medium">Titre :</span> {selectedSession.state.RapportDeSortie.main_report?.title}</div>
                          <div><span className="font-medium">Date :</span> {selectedSession.state.RapportDeSortie.main_report?.date_of_visit}</div>
                          <div><span className="font-medium">Agriculteur :</span> {selectedSession.state.RapportDeSortie.main_report?.farmer}</div>
                          <div><span className="font-medium">TC :</span> {selectedSession.state.RapportDeSortie.main_report?.tc}</div>
                          <div className="whitespace-pre-wrap"><span className="font-medium">Résumé :</span> {selectedSession.state.RapportDeSortie.main_report?.report_summary}</div>
                        </div>
                      </div>

                      {/* Tableau de bord stratégique */}
                      {selectedSession.state.RapportDeSortie.strategic_dashboard && (
                        <div className="space-y-5">
                          <h3 className="text-lg font-semibold">Tableau de bord stratégique</h3>
                          <Separator className="my-2" />

                          {/* Synthèse proactive */}
                          {selectedSession.state.RapportDeSortie.strategic_dashboard.proactive_insights && (
                            <div className="space-y-2">
                              <h4 className="font-medium">Synthèse proactive</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <div className="text-sm font-medium mb-1">Points identifiés</div>
                                  <ul className="list-disc pl-5 text-sm space-y-1">
                                    {selectedSession.state.RapportDeSortie.strategic_dashboard.proactive_insights.identified_issues?.map((i: string, idx: number) => (
                                      <li key={`pi-ii-${idx}`}>{i}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <div className="text-sm font-medium mb-1">Pistes/solutions</div>
                                  <ul className="list-disc pl-5 text-sm space-y-1">
                                    {selectedSession.state.RapportDeSortie.strategic_dashboard.proactive_insights.proposed_solutions?.map((i: string, idx: number) => (
                                      <li key={`pi-ps-${idx}`}>{i}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Plan d'action */}
                          {selectedSession.state.RapportDeSortie.strategic_dashboard.action_plan && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <h4 className="font-medium">Plan d'action – TC</h4>
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                  {selectedSession.state.RapportDeSortie.strategic_dashboard.action_plan.for_tc?.map((i: string, idx: number) => (
                                    <li key={`ap-tc-${idx}`}>{i}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium">Plan d'action – Agriculteur</h4>
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                  {selectedSession.state.RapportDeSortie.strategic_dashboard.action_plan.for_farmer?.map((i: string, idx: number) => (
                                    <li key={`ap-farmer-${idx}`}>{i}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* Détecteur d'opportunités */}
                          {selectedSession.state.RapportDeSortie.strategic_dashboard.opportunity_detector && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <h4 className="font-medium">Opportunités (ventes)</h4>
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                  {selectedSession.state.RapportDeSortie.strategic_dashboard.opportunity_detector.sales?.map((i: string, idx: number) => (
                                    <li key={`od-sales-${idx}`}>{i}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium">Conseils</h4>
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                  {selectedSession.state.RapportDeSortie.strategic_dashboard.opportunity_detector.advice?.map((i: string, idx: number) => (
                                    <li key={`od-adv-${idx}`}>{i}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium">Projets agriculteur</h4>
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                  {selectedSession.state.RapportDeSortie.strategic_dashboard.opportunity_detector.farmer_projects?.map((i: string, idx: number) => (
                                    <li key={`od-fp-${idx}`}>{i}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* Analyse des risques */}
                          {selectedSession.state.RapportDeSortie.strategic_dashboard.risk_analysis && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <h4 className="font-medium">Risque commercial</h4>
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                  {selectedSession.state.RapportDeSortie.strategic_dashboard.risk_analysis.commercial?.map((i: string, idx: number) => (
                                    <li key={`risk-com-${idx}`}>{i}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium">Risque technique</h4>
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                  {selectedSession.state.RapportDeSortie.strategic_dashboard.risk_analysis.technical?.map((i: string, idx: number) => (
                                    <li key={`risk-tech-${idx}`}>{i}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium">Signaux faibles</h4>
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                  {selectedSession.state.RapportDeSortie.strategic_dashboard.risk_analysis.weak_signals?.map((i: string, idx: number) => (
                                    <li key={`risk-ws-${idx}`}>{i}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* Baromètre de la relation */}
                          {selectedSession.state.RapportDeSortie.strategic_dashboard.relationship_barometer && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <h4 className="font-medium">Points de satisfaction</h4>
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                  {selectedSession.state.RapportDeSortie.strategic_dashboard.relationship_barometer.satisfaction_points?.map((i: string, idx: number) => (
                                    <li key={`rel-sat-${idx}`}>{i}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium">Points de frustration</h4>
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                  {selectedSession.state.RapportDeSortie.strategic_dashboard.relationship_barometer.frustration_points?.map((i: string, idx: number) => (
                                    <li key={`rel-frus-${idx}`}>{i}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium">Notes personnelles</h4>
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                  {selectedSession.state.RapportDeSortie.strategic_dashboard.relationship_barometer.personal_notes?.map((i: string, idx: number) => (
                                    <li key={`rel-notes-${idx}`}>{i}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* Préparation du prochain contact */}
                          {selectedSession.state.RapportDeSortie.strategic_dashboard.next_contact_prep && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <h4 className="font-medium">Sujet d'ouverture</h4>
                                <p className="text-sm whitespace-pre-wrap">{selectedSession.state.RapportDeSortie.strategic_dashboard.next_contact_prep.opening_topic}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Objectif de la prochaine visite</h4>
                                <p className="text-sm whitespace-pre-wrap">{selectedSession.state.RapportDeSortie.strategic_dashboard.next_contact_prep.next_visit_objective}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-sm">La session n'est pas terminée. Aucun rapport généré pour l'instant.</div>
                      <Button onClick={() => handleGoToSession(selectedSession.id)}>Ouvrir le temps réel</Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
