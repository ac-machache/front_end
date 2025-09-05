"use client";
import React, { useMemo, useRef, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import type { Config, Session } from '@/lib/types';
import { LogLevel } from '@/lib/types';
import { useLocalStorage, useApiClient } from '@/lib/hooks';
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
  // Logs removed from UI; keep a minimal logger
  const [isCreating, setIsCreating] = useState(false);
  const [isListing, setIsListing] = useState(false);
  // Controlled Accordion expanded sections
  const [expandedReportSection, setExpandedReportSection] = useState<React.Key | null>('main_report');
  const [expandedStrategicSection, setExpandedStrategicSection] = useState<React.Key | null>('proactive_insights');
  const [reportReadyById, setReportReadyById] = useState<Record<string, boolean>>({});

  const addLog = useCallback((level: LogLevel, message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      try { console.debug(`[${level}] ${message}`, data ?? ''); } catch {}
    }
  }, []);

  const apiClient = useApiClient(config, addLog);

  const handleApiResponse = (title: string, data: any) => {
    if (!data) return;
    setApiResultTitle(title);
    setApiResult(data);
    if (title.startsWith('Create Session') && data.id) setConfig(prev => ({ ...prev, sessionId: data.id }));
  };

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
        // Navigate directly to realtime session page
        setConfig(prev => ({ ...prev, sessionId: result.id }));
        router.push(`/session/${result.id}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Prompt user for required fields and start visit
  const startVisit = async () => {
    const nom_tc = window.prompt('Nom TC');
    if (nom_tc == null || nom_tc.trim() === '') return;
    const nom_agri = window.prompt('Nom Agri');
    if (nom_agri == null || nom_agri.trim() === '') return;
    await create({ nom_tc: nom_tc.trim(), nom_agri: nom_agri.trim() });
  };

  // Refresh sessions and determine which have a report ready
  const refreshSessions = async () => {
    setIsListing(true);
    try {
      const data = await apiClient.listSessions();
      handleApiResponse('Session List', data);
      if (Array.isArray(data)) {
        const statusMap: Record<string, boolean> = {};
        for (const s of data as any[]) {
          statusMap[s.id] = !!(s?.state?.RapportDeSortie);
        }
        setReportReadyById(statusMap);
      }
    } finally {
      setIsListing(false);
    }
  };

  // Select session: fetch details and display on the right panel (no navigation)
  const showSessionDetails = async (sessionId: string) => {
    setSelectedSession(null);
    setIsLoadingSession(true);
    try {
      const details = await apiClient.getSession(sessionId);
      setSelectedSession(details);
      setApiResultTitle('Rapport de Visite');
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

  const formatRelativeTime = (ts?: string | number) => {
    if (ts == null) return '—';
    const n = typeof ts === 'string' ? parseFloat(ts) : Number(ts);
    if (!isFinite(n)) return '—';
    const diffMs = Date.now() - n * 1000;
    const seconds = Math.max(0, Math.floor(diffMs / 1000));
    if (seconds < 60) return `il y a ${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `il y a ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `il y a ${days} j`;
    const d = new Date(n * 1000);
    return d.toLocaleDateString();
  };

  const getSessionTitle = (s: any) => {
    const mr = s?.state?.RapportDeSortie?.main_report;
    if (mr?.title) return mr.title;
    const tc = s?.state?.nom_tc || 'TC ?';
    const ag = s?.state?.nom_agri || 'Agri ?';
    return `Visite: ${tc} → ${ag}`;
  };

  const getSessionSubtitle = (s: any) => {
    const mr = s?.state?.RapportDeSortie?.main_report;
    if (mr?.date_of_visit) return `Visite du ${mr.date_of_visit}`;
    return `Mis à jour ${formatRelativeTime(s?.lastUpdateTime)}`;
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
              <CardTitle>Démarrer une visite</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" disabled={isCreating} onClick={startVisit}>
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isCreating ? 'Démarrage…' : 'Commencer une Visite'}
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Vos visites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" disabled={isListing} onClick={refreshSessions}>
                  {isListing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isListing ? 'Chargement…' : 'Actualiser la liste'}
                </Button>
                <div className="space-y-2">
                {Array.isArray(apiResult) && apiResult.length > 0 ? (
                  apiResult.map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between rounded-md border px-3 py-2 gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{getSessionTitle(s)}</div>
                        <div className="text-xs text-muted-foreground truncate">{getSessionSubtitle(s)}</div>
                      </div>
                      <Button
                        size="sm"
                        variant={reportReadyById[s.id] ? 'default' : 'secondary'}
                        onClick={() => (reportReadyById[s.id] ? showSessionDetails(s.id) : handleGoToSession(s.id))}
                      >
                        {reportReadyById[s.id] ? 'Voir le rapport' : 'Ouvrir en direct'}
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune visite. Cliquez sur "Actualiser la liste".</p>
                )}
                </div>
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
                    <Accordion
                      className="space-y-3"
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      variants={{
                        expanded: { opacity: 1, height: 'auto', y: 0 },
                        collapsed: { opacity: 0, height: 0, y: -8 },
                      }}
                      expandedValue={expandedReportSection}
                      onValueChange={setExpandedReportSection}
                    >
                      <AccordionItem value="main_report" className="rounded-md border">
                        <AccordionTrigger className="w-full text-left text-lg font-semibold px-4 py-3">Rapport principal</AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Titre :</span> {selectedSession.state.RapportDeSortie.main_report?.title}</div>
                            <div><span className="font-medium">Date :</span> {selectedSession.state.RapportDeSortie.main_report?.date_of_visit}</div>
                            <div><span className="font-medium">Agriculteur :</span> {selectedSession.state.RapportDeSortie.main_report?.farmer}</div>
                            <div><span className="font-medium">TC :</span> {selectedSession.state.RapportDeSortie.main_report?.tc}</div>
                            <div className="whitespace-pre-wrap"><span className="font-medium">Résumé :</span> {selectedSession.state.RapportDeSortie.main_report?.report_summary}</div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {selectedSession.state.RapportDeSortie.strategic_dashboard && (
                        <AccordionItem value="strategic_dashboard" className="rounded-md border">
                          <AccordionTrigger className="w-full text-left text-lg font-semibold px-4 py-3">Tableau de bord stratégique</AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <Accordion
                              className="space-y-3"
                              transition={{ duration: 0.2, ease: 'easeInOut' }}
                              variants={{
                                expanded: { opacity: 1, height: 'auto', y: 0 },
                                collapsed: { opacity: 0, height: 0, y: -6 },
                              }}
                              expandedValue={expandedStrategicSection}
                              onValueChange={setExpandedStrategicSection}
                            >
                              {selectedSession.state.RapportDeSortie.strategic_dashboard.proactive_insights && (
                                <AccordionItem value="proactive_insights" className="rounded border">
                                  <AccordionTrigger className="w-full text-left font-medium px-3 py-2">Synthèse proactive</AccordionTrigger>
                                  <AccordionContent className="px-3 pb-3">
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
                                  </AccordionContent>
                                </AccordionItem>
                              )}

                              {selectedSession.state.RapportDeSortie.strategic_dashboard.action_plan && (
                                <AccordionItem value="action_plan" className="rounded border">
                                  <AccordionTrigger className="w-full text-left font-medium px-3 py-2">Plan d'action</AccordionTrigger>
                                  <AccordionContent className="px-3 pb-3">
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
                                  </AccordionContent>
                                </AccordionItem>
                              )}

                              {selectedSession.state.RapportDeSortie.strategic_dashboard.opportunity_detector && (
                                <AccordionItem value="opportunity_detector" className="rounded border">
                                  <AccordionTrigger className="w-full text-left font-medium px-3 py-2">Détecteur d'opportunités</AccordionTrigger>
                                  <AccordionContent className="px-3 pb-3">
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
                                  </AccordionContent>
                                </AccordionItem>
                              )}

                              {selectedSession.state.RapportDeSortie.strategic_dashboard.risk_analysis && (
                                <AccordionItem value="risk_analysis" className="rounded border">
                                  <AccordionTrigger className="w-full text-left font-medium px-3 py-2">Analyse des risques</AccordionTrigger>
                                  <AccordionContent className="px-3 pb-3">
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
                                  </AccordionContent>
                                </AccordionItem>
                              )}

                              {selectedSession.state.RapportDeSortie.strategic_dashboard.relationship_barometer && (
                                <AccordionItem value="relationship_barometer" className="rounded border">
                                  <AccordionTrigger className="w-full text-left font-medium px-3 py-2">Baromètre de la relation</AccordionTrigger>
                                  <AccordionContent className="px-3 pb-3">
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
                                  </AccordionContent>
                                </AccordionItem>
                              )}

                              {selectedSession.state.RapportDeSortie.strategic_dashboard.next_contact_prep && (
                                <AccordionItem value="next_contact_prep" className="rounded border">
                                  <AccordionTrigger className="w-full text-left font-medium px-3 py-2">Préparation du prochain contact</AccordionTrigger>
                                  <AccordionContent className="px-3 pb-3">
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
                                  </AccordionContent>
                                </AccordionItem>
                              )}
                            </Accordion>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </Accordion>
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
