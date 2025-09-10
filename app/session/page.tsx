"use client";
import React, { useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import type { Session, SessionDetails } from '@/lib/types';
import { LogLevel } from '@/lib/types';
import { useApiClient } from '@/lib/hooks';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { getClientById, listSessionsForClient, setClientSessionDoc, updateClientSessionDoc } from '@/lib/firebase';

type ClientDoc = { id: string; name?: string; email?: string };

function SessionsPageInner() {
  const router = useRouter();
  // Wrap useSearchParams usage behind local state to satisfy build-time SSR bailouts
  const params = useSearchParams();
  const { user, loading } = useAuth();

  // clientId provenant de /session?clientId=xxx
  const clientId = typeof window !== 'undefined' ? (params?.get('clientId') || '') : '';

  // États UI (anciens)
  const [apiResultTitle, setApiResultTitle] = React.useState('Espace session');
  const [selectedSession, setSelectedSession] = React.useState<SessionDetails | null>(null);
  const [isLoadingSession, setIsLoadingSession] = React.useState(false);
  const [isListing, setIsListing] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [expandedReportSection, setExpandedReportSection] = React.useState<React.Key | null>('main_report');
  const [expandedStrategicSection, setExpandedStrategicSection] = React.useState<React.Key | null>('proactive_insights');

  // Liste des sessions: maintenant stockée dans Firestore (sessions du client)
  const [firestoreSessions, setFirestoreSessions] = React.useState<Array<{ id: string; is_report_done?: boolean }>>([]);
  const [reportReadyById, setReportReadyById] = React.useState<Record<string, boolean>>({});

  // Client (pour nom_agri)
  const [clientDoc, setClientDoc] = React.useState<ClientDoc | null>(null);

  // Garde d’auth / clientId requis
  React.useEffect(() => {
    if (!loading && !user) router.replace('/welcome');
  }, [loading, user, router]);

  // Logger minimal
  const addLog = useCallback((level: LogLevel, message: string, data?: unknown) => {
    if (process.env.NODE_ENV !== 'production') {
      try { console.debug(`[${level}] ${message}`, data ?? ''); } catch {}
    }
  }, []);

  // IMPORTANT: on adresse le backend sous l'utilisateur du CLIENT (userId = clientId)
  const apiClient = useApiClient({
    scheme: (typeof window !== 'undefined' && window.location.protocol === 'https:') ? 'wss' : 'ws',
    host: 'env',
    port: '0',
    appName: 'app',
    userId: clientId || 'user',
    sessionId: ''
  }, addLog);

  // Stabilize backend getter across renders to avoid effect loops
  const getSessionRef = React.useRef<(id: string) => Promise<SessionDetails | null>>(async () => null);
  React.useEffect(() => { getSessionRef.current = (apiClient.getSession as (id: string) => Promise<SessionDetails | null>); }, [apiClient]);

  // Charger le doc client + la liste des sessions Firestore
  const refreshSessions = useCallback(async () => {
    if (!user || !clientId) {
      setFirestoreSessions([]);
      setClientDoc(null);
      return;
    }
    setIsListing(true);
    try {
      // Récupérer client (nom pour nom_agri)
      const c = await getClientById(user.uid, clientId);
      setClientDoc(c as ClientDoc);

      // Récupérer les sessions du client depuis Firestore
      const list = await listSessionsForClient(user.uid, clientId);
      const minimal = (list as Array<{ id: string; is_report_done?: boolean }>).map((d: { id: string; is_report_done?: boolean }) => ({
        id: d.id,
        is_report_done: d.is_report_done ?? false,
      }));
      setFirestoreSessions(minimal);

      // Vérifier l'état réel côté backend (en parallèle) et mettre à jour Firestore si nécessaire
      const checks = await Promise.all(
        minimal.map(async (s) => {
          try {
            const details = await getSessionRef.current(s.id) as SessionDetails | null;
            const ready = !!details?.state?.RapportDeSortie;
            return { id: s.id, ready };
          } catch {
            return { id: s.id, ready: !!s.is_report_done };
          }
        })
      );

      const nextStatusMap: Record<string, boolean> = {};
      for (const chk of checks) {
        nextStatusMap[chk.id] = chk.ready;
      }
      setReportReadyById(nextStatusMap);

      // Mettre à jour les docs Firestore si un rapport est devenu prêt
      await Promise.all(
        checks
          .filter((chk) => chk.ready)
          .map((chk) => updateClientSessionDoc(user.uid!, clientId, chk.id, { is_report_done: true }))
      ).catch(() => { /* non bloquant */ });

      setApiResultTitle('Liste des sessions');
    } finally {
      setIsListing(false);
    }
  }, [user?.uid, clientId]);

  React.useEffect(() => { refreshSessions(); }, [refreshSessions]);

  

  const handleGoToSession = (sessionId: string) => { router.push(`/session/${sessionId}?clientId=${clientId}`); };

  // Démarrer une nouvelle visite:
  // 1) créer la session côté backend avec userId = clientId
  // 2) stocker la session dans Firestore: users/{uid}/clients/{clientId}/sessions/{sessionId}
  const startVisit = async () => {
    if (!user || !clientId) return;
    setIsCreating(true);
    try {
      const nom_tc = user.displayName || user.email || 'Utilisateur';
      const nom_agri = clientDoc?.name || 'Client';

      const result = await apiClient.createSession({ nom_tc, nom_agri }) as Session | null;
      if (result?.id) {
        // Enregistrer la session dans Firestore sous le même ID (en arrière-plan)
        setClientSessionDoc(
          user.uid,
          clientId,
          result.id,
          { nom_tc, nom_agri, is_report_done: false, ReportKey: null }
        )
          .then(() => { void refreshSessions(); })
          .catch((err) => { addLog(LogLevel.Error, 'Failed to persist session to Firestore', err); });
        // Aller immédiatement au temps réel
        router.push(`/session/${result.id}?clientId=${clientId}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Afficher un rapport depuis le backend (getSession)
  const showSessionDetails = async (sessionId: string) => {
    setSelectedSession(null);
    setIsLoadingSession(true);
    try {
      const details = await apiClient.getSession(sessionId) as SessionDetails | null;
      if (details) setSelectedSession(details);
      setApiResultTitle('Rapport de Visite');
    } finally {
      setIsLoadingSession(false);
    }
  };

  // États de garde UI
  if (loading || !user) {
    return <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center text-sm text-muted-foreground">Chargement…</div>;
  }
  if (!clientId) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center text-sm text-muted-foreground">
        Ouvrez cette page depuis vos clients (aucun client sélectionné).
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center gap-3 flex-col md:flex-row">
        <div className="w-full">
          <h1 className="text-xl md:text-2xl font-semibold">IAdvisor</h1>
          <p className="text-sm md:text-base text-muted-foreground">Gérez vos sessions pour: {clientDoc?.name || clientId}</p>
        </div>
        <div className="hidden md:block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
        {/* Colonne gauche: démarrer / lister */}
        <div className="col-span-1 md:col-span-4 space-y-4">
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
                  {Array.isArray(firestoreSessions) && firestoreSessions.length > 0 ? (
                    firestoreSessions.map((s) => (
                      <div key={s.id} className="flex items-center justify-between rounded-md border px-3 py-2 gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{s.id}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {reportReadyById[s.id] ? 'Rapport disponible' : 'En cours…'}
                          </div>
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
                    <p className="text-sm text-muted-foreground">Aucune visite. Cliquez sur « Actualiser ».</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite: aperçu rapport */}
        <div className="col-span-1 md:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>{apiResultTitle}</CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto">
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
                        <AccordionContent className="px-4 pb-4 pt-3 border-t">
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
                          <AccordionContent className="px-4 pb-4 pt-3 border-t">
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
                                  <AccordionContent className="px-3 pb-3 pt-3 border-t">
                                    <div className="space-y-4">
                                      {((selectedSession.state.RapportDeSortie.strategic_dashboard.proactive_insights.identified_issues?.length ?? 0) > 0) && (
                                        <div className="space-y-1">
                                          <div className="text-sm font-medium">Points identifiés</div>
                                          <ul className="list-disc pl-5 text-sm space-y-1">
                                            {selectedSession.state.RapportDeSortie.strategic_dashboard.proactive_insights.identified_issues?.map((i: string, idx: number) => (
                                              <li key={`pi-ii-${idx}`}>{i}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      {((selectedSession.state.RapportDeSortie.strategic_dashboard.proactive_insights.proposed_solutions?.length ?? 0) > 0) && (
                                        <div className="space-y-1">
                                          <div className="text-sm font-medium">Pistes/solutions</div>
                                          <ul className="list-disc pl-5 text-sm space-y-1">
                                            {selectedSession.state.RapportDeSortie.strategic_dashboard.proactive_insights.proposed_solutions?.map((i: string, idx: number) => (
                                              <li key={`pi-ps-${idx}`}>{i}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              )}

                              {selectedSession.state.RapportDeSortie.strategic_dashboard.action_plan && (
                                <AccordionItem value="action_plan" className="rounded border">
                                  <AccordionTrigger className="w-full text-left font-medium px-3 py-2">Plan d’action</AccordionTrigger>
                                  <AccordionContent className="px-3 pb-3 pt-3 border-t">
                                    <div className="space-y-4">
                                      {((selectedSession.state.RapportDeSortie.strategic_dashboard.action_plan.for_tc?.length ?? 0) > 0) && (
                                        <div className="space-y-1">
                                          <h4 className="font-medium">Plan d’action – TC</h4>
                                          <ul className="list-disc pl-5 text-sm space-y-1">
                                            {selectedSession.state.RapportDeSortie.strategic_dashboard.action_plan.for_tc?.map((i: string, idx: number) => (
                                              <li key={`ap-tc-${idx}`}>{i}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      {((selectedSession.state.RapportDeSortie.strategic_dashboard.action_plan.for_farmer?.length ?? 0) > 0) && (
                                        <div className="space-y-1">
                                          <h4 className="font-medium">Plan d’action – Agriculteur</h4>
                                          <ul className="list-disc pl-5 text-sm space-y-1">
                                            {selectedSession.state.RapportDeSortie.strategic_dashboard.action_plan.for_farmer?.map((i: string, idx: number) => (
                                              <li key={`ap-farmer-${idx}`}>{i}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              )}

                              {selectedSession.state.RapportDeSortie.strategic_dashboard.opportunity_detector && (
                                <AccordionItem value="opportunity_detector" className="rounded border">
                                  <AccordionTrigger className="w-full text-left font-medium px-3 py-2">Détecteur d’opportunités</AccordionTrigger>
                                  <AccordionContent className="px-3 pb-3 pt-3 border-t">
                                    <div className="space-y-4">
                                      {((selectedSession.state.RapportDeSortie.strategic_dashboard.opportunity_detector.sales?.length ?? 0) > 0) && (
                                        <div className="space-y-1">
                                          <h4 className="font-medium">Opportunités (ventes)</h4>
                                          <ul className="list-disc pl-5 text-sm space-y-1">
                                            {selectedSession.state.RapportDeSortie.strategic_dashboard.opportunity_detector.sales?.map((i: string, idx: number) => (
                                              <li key={`od-sales-${idx}`}>{i}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      {((selectedSession.state.RapportDeSortie.strategic_dashboard.opportunity_detector.advice?.length ?? 0) > 0) && (
                                        <div className="space-y-1">
                                          <h4 className="font-medium">Conseils</h4>
                                          <ul className="list-disc pl-5 text-sm space-y-1">
                                            {selectedSession.state.RapportDeSortie.strategic_dashboard.opportunity_detector.advice?.map((i: string, idx: number) => (
                                              <li key={`od-adv-${idx}`}>{i}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      {((selectedSession.state.RapportDeSortie.strategic_dashboard.opportunity_detector.farmer_projects?.length ?? 0) > 0) && (
                                        <div className="space-y-1">
                                          <h4 className="font-medium">Projets agriculteur</h4>
                                          <ul className="list-disc pl-5 text-sm space-y-1">
                                            {selectedSession.state.RapportDeSortie.strategic_dashboard.opportunity_detector.farmer_projects?.map((i: string, idx: number) => (
                                              <li key={`od-fp-${idx}`}>{i}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              )}

                              {selectedSession.state.RapportDeSortie.strategic_dashboard.risk_analysis && (
                                <AccordionItem value="risk_analysis" className="rounded border">
                                  <AccordionTrigger className="w-full text-left font-medium px-3 py-2">Analyse des risques</AccordionTrigger>
                                  <AccordionContent className="px-3 pb-3 pt-3 border-t">
                                    <div className="space-y-4">
                                      {((selectedSession.state.RapportDeSortie.strategic_dashboard.risk_analysis.commercial?.length ?? 0) > 0) && (
                                        <div className="space-y-1">
                                          <h4 className="font-medium">Risque commercial</h4>
                                          <ul className="list-disc pl-5 text-sm space-y-1">
                                            {selectedSession.state.RapportDeSortie.strategic_dashboard.risk_analysis.commercial?.map((i: string, idx: number) => (
                                              <li key={`risk-com-${idx}`}>{i}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      {((selectedSession.state.RapportDeSortie.strategic_dashboard.risk_analysis.technical?.length ?? 0) > 0) && (
                                        <div className="space-y-1">
                                          <h4 className="font-medium">Risque technique</h4>
                                          <ul className="list-disc pl-5 text-sm space-y-1">
                                            {selectedSession.state.RapportDeSortie.strategic_dashboard.risk_analysis.technical?.map((i: string, idx: number) => (
                                              <li key={`risk-tech-${idx}`}>{i}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      {((selectedSession.state.RapportDeSortie.strategic_dashboard.risk_analysis.weak_signals?.length ?? 0) > 0) && (
                                        <div className="space-y-1">
                                          <h4 className="font-medium">Signaux faibles</h4>
                                          <ul className="list-disc pl-5 text-sm space-y-1">
                                            {selectedSession.state.RapportDeSortie.strategic_dashboard.risk_analysis.weak_signals?.map((i: string, idx: number) => (
                                              <li key={`risk-ws-${idx}`}>{i}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              )}

                              {selectedSession.state.RapportDeSortie.strategic_dashboard.relationship_barometer && (
                                <AccordionItem value="relationship_barometer" className="rounded border">
                                  <AccordionTrigger className="w-full text-left font-medium px-3 py-2">Baromètre de la relation</AccordionTrigger>
                                  <AccordionContent className="px-3 pb-3 pt-3 border-t">
                                    <div className="space-y-4">
                                      {((selectedSession.state.RapportDeSortie.strategic_dashboard.relationship_barometer.satisfaction_points?.length ?? 0) > 0) && (
                                        <div className="space-y-1">
                                          <h4 className="font-medium">Points de satisfaction</h4>
                                          <ul className="list-disc pl-5 text-sm space-y-1">
                                            {selectedSession.state.RapportDeSortie.strategic_dashboard.relationship_barometer.satisfaction_points?.map((i: string, idx: number) => (
                                              <li key={`rel-sat-${idx}`}>{i}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      {((selectedSession.state.RapportDeSortie.strategic_dashboard.relationship_barometer.frustration_points?.length ?? 0) > 0) && (
                                        <div className="space-y-1">
                                          <h4 className="font-medium">Points de frustration</h4>
                                          <ul className="list-disc pl-5 text-sm space-y-1">
                                            {selectedSession.state.RapportDeSortie.strategic_dashboard.relationship_barometer.frustration_points?.map((i: string, idx: number) => (
                                              <li key={`rel-frus-${idx}`}>{i}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      {((selectedSession.state.RapportDeSortie.strategic_dashboard.relationship_barometer.personal_notes?.length ?? 0) > 0) && (
                                        <div className="space-y-1">
                                          <h4 className="font-medium">Notes personnelles</h4>
                                          <ul className="list-disc pl-5 text-sm space-y-1">
                                            {selectedSession.state.RapportDeSortie.strategic_dashboard.relationship_barometer.personal_notes?.map((i: string, idx: number) => (
                                              <li key={`rel-notes-${idx}`}>{i}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              )}

                              {selectedSession.state.RapportDeSortie.strategic_dashboard.next_contact_prep && (
                                <AccordionItem value="next_contact_prep" className="rounded border">
                                  <AccordionTrigger className="w-full text-left font-medium px-3 py-2">Préparation du prochain contact</AccordionTrigger>
                                  <AccordionContent className="px-3 pb-3 pt-3 border-t">
                                    <div className="space-y-4">
                                      {(typeof selectedSession.state.RapportDeSortie.strategic_dashboard.next_contact_prep.opening_topic === 'string' && selectedSession.state.RapportDeSortie.strategic_dashboard.next_contact_prep.opening_topic.trim() !== '') && (
                                        <div className="space-y-1">
                                          <h4 className="font-medium">Sujet d’ouverture</h4>
                                          <p className="text-sm whitespace-pre-wrap">{selectedSession.state.RapportDeSortie.strategic_dashboard.next_contact_prep.opening_topic}</p>
                                        </div>
                                      )}
                                      {(typeof selectedSession.state.RapportDeSortie.strategic_dashboard.next_contact_prep.next_visit_objective === 'string' && selectedSession.state.RapportDeSortie.strategic_dashboard.next_contact_prep.next_visit_objective.trim() !== '') && (
                                        <div className="space-y-1">
                                          <h4 className="font-medium">Objectif de la prochaine visite</h4>
                                          <p className="text-sm whitespace-pre-wrap">{selectedSession.state.RapportDeSortie.strategic_dashboard.next_contact_prep.next_visit_objective}</p>
                                        </div>
                                      )}
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
                      <div className="text-sm">La session n’est pas terminée. Aucun rapport généré pour l’instant.</div>
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

export default function SessionsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center text-sm text-muted-foreground">Chargement…</div>}>
      <SessionsPageInner />
    </Suspense>
  );
}