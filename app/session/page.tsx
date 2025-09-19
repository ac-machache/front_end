"use client";
import React, { useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Session, SessionDetails, SessionState } from '@/lib/types';
import { LogLevel } from '@/lib/types';
import { useApiClient } from '@/lib/hooks';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { getClientById, listSessionsForClient, setClientSessionDoc, updateClientSessionDoc, deleteClientSessionDoc } from '@/lib/firebase';
import { ChevronRightCircleSolid, BookOpenSolid, ChatPlusSolid, RefreshAltSolid, PanelRightOpenSolid, TrashOneSolid, BookImageSolid } from '@mynaui/icons-react';
import Link from 'next/link';

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
  const [firestoreSessions, setFirestoreSessions] = React.useState<Array<{ id: string; is_report_done?: boolean; saved?: boolean }>>([]);
  const [reportReadyById, setReportReadyById] = React.useState<Record<string, boolean>>({});
  const [displayLabelsById, setDisplayLabelsById] = React.useState<Record<string, { title: string; subtitle?: string }>>({});

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
  const listSessionsRef = React.useRef<() => Promise<Session[] | null>>(async () => null);
  React.useEffect(() => { listSessionsRef.current = (apiClient.listSessions as () => Promise<Session[] | null>); }, [apiClient]);

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
      const minimal = (list as Array<{ id: string; is_report_done?: boolean; saved?: boolean }>).map((d) => ({
        id: d.id,
        is_report_done: d.is_report_done ?? false,
        saved: d.saved ?? false,
      }));
      setFirestoreSessions(minimal);

      // Récupérer la liste des sessions depuis le backend (un seul appel)
      const backendList = await listSessionsRef.current();
      const backendById: Record<string, SessionDetails> = {};
      if (Array.isArray(backendList)) {
        for (const s of backendList as SessionDetails[]) {
          backendById[s.id] = s;
        }
      }
      // Vérifier l'état réel côté backend et préparer mises à jour Firestore
      const checks = minimal.map((s) => {
        const details = backendById[s.id];
        const report = (details?.state as unknown as { RapportDeSortie?: unknown })?.RapportDeSortie;
        const ready = !!report;
        return { id: s.id, ready, report } as { id: string; ready: boolean; report?: unknown };
      });

      // Mettre à jour les docs Firestore si un rapport est devenu prêt (+ ReportKey)
      await Promise.allSettled(
        checks
          .filter((chk) => chk.ready)
          .map((chk) => updateClientSessionDoc(user.uid!, clientId, chk.id, { is_report_done: true, ReportKey: chk.report ?? null }))
      );

      // Recharger depuis Firestore après mises à jour pour refléter is_report_done/saved au plus juste
      try {
        const relist = await listSessionsForClient(user.uid, clientId);
        const relistMinimal = (relist as Array<{ id: string; is_report_done?: boolean; saved?: boolean }>).
          map((d) => ({ id: d.id, is_report_done: d.is_report_done ?? false, saved: d.saved ?? false }));
        setFirestoreSessions(relistMinimal);
      } catch {}

      const nextStatusMap: Record<string, boolean> = {};
      const nextLabelsMap: Record<string, { title: string; subtitle?: string }> = {};
      for (const s of backendList as SessionDetails[] || []) {
        const state = (s?.state as SessionState | undefined);
        const main = state?.RapportDeSortie?.main_report;
        const title = (typeof main?.title === 'string' && main.title.trim() !== '')
          ? main.title
          : (typeof main?.farmer === 'string' && main.farmer.trim() !== '')
            ? main.farmer
            : (typeof state?.nom_agri === 'string' && state.nom_agri.trim() !== '')
              ? state.nom_agri
              : (clientDoc?.name || s.id);
        const dateRaw = (typeof main?.date_of_visit === 'string' && main.date_of_visit.trim() !== '')
          ? main.date_of_visit
          : (typeof s?.lastUpdateTime === 'string' ? s.lastUpdateTime : undefined);
        let dateFormatted: string | undefined;
        try { dateFormatted = dateRaw ? new Date(dateRaw).toLocaleString() : undefined; } catch {}
        const subtitleParts: string[] = [];
        if (dateFormatted) subtitleParts.push(dateFormatted);
        if (typeof state?.nom_tc === 'string' && state.nom_tc.trim() !== '') subtitleParts.push(state.nom_tc);
        const subtitle = subtitleParts.join(' · ');
        nextLabelsMap[s.id] = { title, subtitle: subtitle || undefined };

        const ready = !!state?.RapportDeSortie;
        nextStatusMap[s.id] = ready;
      }
      setReportReadyById(nextStatusMap);
      setDisplayLabelsById(nextLabelsMap);

      setApiResultTitle('Liste des sessions');
    } finally {
      setIsListing(false);
    }
  }, [user, clientId]);

  React.useEffect(() => { refreshSessions(); }, [refreshSessions]);

  

  const handleGoToSession = (sessionId: string) => { router.push(`/session/${sessionId}?clientId=${clientId}`); };

  // Démarrer une nouvelle visite:
  // 1) créer la session côté backend avec userId = clientId
  // 2) stocker la session dans Firestore: users/{uid}/clients/{clientId}/sessions/{sessionId}
  const startVisit = React.useCallback(async () => {
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
  }, [user, clientId, clientDoc?.name, apiClient, addLog, router, refreshSessions]);

  // Afficher un rapport depuis le backend (getSession)
  const showSessionDetails = React.useCallback(async (sessionId: string) => {
    setSelectedSession(null);
    setIsLoadingSession(true);
    try {
      const details = await apiClient.getSession(sessionId) as SessionDetails | null;
      if (details) setSelectedSession(details);
      setApiResultTitle('Rapport de Visite');
    } finally {
      setIsLoadingSession(false);
    }
  }, [apiClient]);

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
        <p className="w-full md:w-auto text-base md:text-lg font-semibold">Gérez vos sessions pour: {clientDoc?.name || clientId}</p>
        <Button asChild className="w-full md:w-auto h-10 px-4 rounded-full bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white">
          <Link href="/clients"><PanelRightOpenSolid className="mr-2" />Retour aux clients</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-4">
        {/* Démarrer / lister */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Démarrer une visite</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full h-10 px-4 gap-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white" disabled={isCreating} onClick={startVisit}>
                  {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChatPlusSolid />}
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
                <Button className="w-full h-10 px-4 gap-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white" disabled={isListing} onClick={refreshSessions}>
                  {isListing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshAltSolid />}
                  {isListing ? 'Chargement…' : 'Actualiser la liste'}
                </Button>

                <div className="space-y-2">
                  {Array.isArray(firestoreSessions) && firestoreSessions.length > 0 ? (
                    firestoreSessions.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between rounded-md border px-3 py-3 gap-3 md:gap-2 min-h-14 md:min-h-12 cursor-pointer hover:bg-accent/40 focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none select-none"
                        role="button"
                        tabIndex={0}
                        onClick={() => handleGoToSession(s.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleGoToSession(s.id); } }}
                        aria-label={`Ouvrir la session ${s.id}`}
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{displayLabelsById[s.id]?.title || clientDoc?.name || s.id}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {displayLabelsById[s.id]?.subtitle ? `${displayLabelsById[s.id]?.subtitle} • ` : ''}
                            {reportReadyById[s.id] ? 'Rapport disponible' : 'En cours…'}{s.saved ? ' • Sauvegardée' : ''}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 md:gap-2" role="group" aria-label="Actions de session">
                          {reportReadyById[s.id] && !s.saved && (
                            <Button
                              size="icon"
                              variant="default"
                              aria-label="Enregistrer en mémoire"
                              title="Enregistrer en mémoire"
                              className="size-11 md:size-9 p-0 rounded-full bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white flex items-center justify-center"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (!user) return;
                                try {
                                  await apiClient.ingestSessionMemoryFor(s.id, true);
                                  await updateClientSessionDoc(user.uid, clientId, s.id, { saved: true });
                                  // Update UI immediately
                                  setFirestoreSessions(prev => prev.map(x => x.id === s.id ? { ...x, saved: true } : x));
                                  void refreshSessions();
                                } catch {}
                              }}
                            >
                              <BookImageSolid className="size-5 md:size-4" />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="default"
                            aria-label={reportReadyById[s.id] ? 'Lire' : 'Ouvrir'}
                            title={reportReadyById[s.id] ? 'Lire le rapport' : 'Ouvrir la session'}
                            className="size-11 md:size-9 p-0 rounded-full bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white flex items-center justify-center"
                            onClick={(e) => { e.stopPropagation(); handleGoToSession(s.id); }}
                          >
                            {reportReadyById[s.id] ? <BookOpenSolid className="size-5 md:size-4" /> : <ChevronRightCircleSolid className="size-5 md:size-4" />}
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            aria-label="Supprimer"
                            title="Supprimer"
                            className="size-11 md:size-9 p-0 rounded-full bg-red-800 hover:bg-red-700 border-red-700 text-white flex items-center justify-center"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!user) return;
                              const ok = window.confirm('Supprimer cette visite ?');
                              if (!ok) return;
                              try { await apiClient.deleteSession(s.id); } catch {}
                              try { await deleteClientSessionDoc(user.uid, clientId, s.id); } catch {}
                              void refreshSessions();
                            }}
                          >
                            <TrashOneSolid className="size-5 md:size-4" />
                          </Button>
                        </div>
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