"use client";
import React, { useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Session, SessionDetails, Result, ClientRecord } from '@/lib/types';
import { LogLevel } from '@/lib/types';
import { useApiClient } from '@/lib/hooks';
import { Loader2 } from 'lucide-react';
import { CalendarDownSolid } from '@mynaui/icons-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useAuth } from '@/components/auth/AuthProvider';
import { getClientById, listSessionsForClient, setClientSessionDoc, updateClientSessionDoc, deleteClientSessionDoc } from '@/lib/firebase';
import { ChevronRightCircleSolid, BookOpenSolid, ChatPlusSolid, RefreshAltSolid, PanelRightOpenSolid, TrashOneSolid, BookImageSolid, BubblesSolid } from '@mynaui/icons-react';
import Link from 'next/link';

type ClientDoc = Pick<ClientRecord, 'id' | 'name' | 'email' | 'contexte'>;

function SessionsPageInner() {
  const router = useRouter();
  // Wrap useSearchParams usage behind local state to satisfy build-time SSR bailouts
  const params = useSearchParams();
  const { user, loading } = useAuth();

  // clientId provenant de /session?clientId=xxx
  const clientId = typeof window !== 'undefined' ? (params?.get('clientId') || '') : '';

  // États UI (anciens)
  const [isListing, setIsListing] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [visitDate, setVisitDate] = React.useState<Date | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const [sessionType, setSessionType] = React.useState<string>('');

  // Liste des sessions: maintenant stockée dans Firestore (sessions du client)
  const [firestoreSessions, setFirestoreSessions] = React.useState<Array<{ id: string; name?: string; is_report_done?: boolean; saved?: boolean }>>([]);
  const [reportReadyById, setReportReadyById] = React.useState<Record<string, boolean>>({});
  const [displayLabelsById, setDisplayLabelsById] = React.useState<Record<string, { title: string; subtitle?: string }>>({});
  const [generatingSessions, setGeneratingSessions] = React.useState<Set<string>>(new Set());

  // Client (pour nom_agri)
  const [clientDoc, setClientDoc] = React.useState<ClientDoc | null>(null);

  // Check localStorage for generating sessions with timeout detection
  const checkGeneratingSessions = useCallback(() => {
    const generating = new Set<string>();
    const now = Date.now();
    const TIMEOUT_MS = 7 * 60 * 1000; // 7 minutes timeout (minimum generation time)
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('generating-report-')) {
        const sessionId = key.replace('generating-report-', '');
        const timestampStr = localStorage.getItem(key);
        
        if (timestampStr) {
          const timestamp = parseInt(timestampStr, 10);
          const elapsed = now - timestamp;
          
          // If generation has been running for more than timeout, consider it stuck
          if (elapsed > TIMEOUT_MS) {
            console.warn(`Report generation for session ${sessionId} timed out after ${Math.round(elapsed / 1000)}s. Cleaning up.`);
            localStorage.removeItem(key);
          } else {
            generating.add(sessionId);
          }
        } else {
          // Old format without timestamp, remove it
          localStorage.removeItem(key);
        }
      }
    }
    setGeneratingSessions(generating);
  }, []);

  // Poll for generating sessions status
  React.useEffect(() => {
    checkGeneratingSessions();
    const interval = setInterval(checkGeneratingSessions, 2000); // Check every 2 seconds
    return () => clearInterval(interval);
  }, [checkGeneratingSessions]);

  // Listen for localStorage changes to detect when generation completes
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('generating-report-') && e.oldValue && !e.newValue) {
        // A generating key was removed, refresh the list
        setTimeout(() => {
          checkGeneratingSessions();
          void refreshSessions();
        }, 500);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkGeneratingSessions]);

  // Garde d'auth / clientId requis
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
  const getSessionRef = React.useRef<(id: string) => Promise<Result<SessionDetails>>>(async () => ({ ok: false, error: new Error('not initialized') }));
  React.useEffect(() => { getSessionRef.current = apiClient.getSession; }, [apiClient]);
  const listSessionsRef = React.useRef<() => Promise<Result<Session[]>>>(async () => ({ ok: false, error: new Error('not initialized') }));
  React.useEffect(() => { listSessionsRef.current = apiClient.listSessions; }, [apiClient]);

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
      if (c) {
        setClientDoc({
          id: c.id,
          name: typeof c.name === 'string' ? c.name : '',
          email: typeof c.email === 'string' ? c.email : '',
          contexte: typeof c.contexte === 'string' ? c.contexte : '',
        });
      } else {
        setClientDoc(null);
      }

      // Récupérer les sessions du client depuis Firestore
      const list = await listSessionsForClient(user.uid, clientId);
      const minimal = (list as Array<{ id: string; name?: string; is_report_done?: boolean; saved?: boolean }>).map((d) => ({
        id: d.id,
        name: typeof d.name === 'string' ? d.name : undefined,
        is_report_done: d.is_report_done ?? false,
        saved: d.saved ?? false,
      }));
      setFirestoreSessions(minimal);

      const nextStatusMap: Record<string, boolean> = {};
      const nextLabelsMap: Record<string, { title: string; subtitle?: string }> = {};
      for (const session of minimal) {
        const ready = session.is_report_done ?? false;
        nextStatusMap[session.id] = ready;

        const subtitleParts: string[] = [];
        if (ready) subtitleParts.push('Rapport disponible');
        if (session.saved) subtitleParts.push('Sauvegardée');
        if (!ready) subtitleParts.push('En cours…');

        nextLabelsMap[session.id] = {
          title: session.name || c?.name || session.id,
          subtitle: subtitleParts.join(' • '),
        };
      }
      setReportReadyById(nextStatusMap);
      setDisplayLabelsById(nextLabelsMap);
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
    if (!user || !clientId || !visitDate || !sessionType) return;
    setIsCreating(true);
    try {
      let clientForSession = clientDoc;
      if (!clientForSession) {
        const fetched = await getClientById(user.uid, clientId);
        if (fetched) {
          clientForSession = {
            id: fetched.id,
            name: typeof fetched.name === 'string' ? fetched.name : '',
            email: typeof fetched.email === 'string' ? fetched.email : '',
            contexte: typeof fetched.contexte === 'string' ? fetched.contexte : '',
          };
          setClientDoc(clientForSession);
        }
      }

      const nom_tc = user.displayName || user.email || 'Utilisateur';
      const nom_agri = clientForSession?.name || 'Client';
      const contexte_client = clientForSession?.contexte ?? '';

      const date_de_visite = format(visitDate, 'dd/MM/yyyy');

      // Session type configurations
      const sessionTypeData: Record<string, string> = {
        avec_client: `**Première intervention et lancement :**
- Salue le technicien commercial.
- Demande directement par quelle thématique il préfère débuter ou quel point il souhaite aborder en priorité.

**Déroulement pour chaque sujet :**
- Demande ce que le client a dit sur le point.
- Recueille ce que le technicien commercial a observé.
- Récupère ce qu'il a proposé ou clarifié au cours de la visite.`,
        parcelle_seule: `**Première intervention et lancement :**
- Salue le technicien commercial.
- Demande directement quel point il a observé en premier sur la parcelle.

**Déroulement pour chaque sujet :**
- Recueille ce que le technicien commercial a observé sur la parcelle.
- Récupère ce qu'il a proposé ou noté pour le suivi.`,
        exploitation_sans_client: `**Première intervention et lancement :**
- Salue le technicien commercial.
- Demande directement quel point il a observé en premier sur l'exploitation.

**Déroulement pour chaque sujet :**
- Recueille ce que le technicien commercial a observé sur l'exploitation.
- Récupère ce qu'il a proposé ou noté pour le suivi.`
      };

      const payload = { 
        nom_tc, 
        nom_agri, 
        contexte_client, 
        date_de_visite,
        type_de_visite: sessionTypeData[sessionType]
      };
      addLog(LogLevel.Event, 'Creating session', payload);
      const result = await apiClient.createSession(payload);
      if (result.ok) {
        // Enregistrer la session dans Firestore sous le même ID (en arrière-plan)
        setClientSessionDoc(
          user.uid,
          clientId,
          result.value.id,
          { nom_tc, nom_agri, is_report_done: false, ReportKey: null }
        )
          .then(() => { void refreshSessions(); })
          .catch((err) => { addLog(LogLevel.Error, 'Failed to persist session to Firestore', err); });
        // Aller immédiatement au temps réel
        router.push(`/session/${result.value.id}?clientId=${clientId}`);
        setVisitDate(undefined);
        setSessionType('');
      }
    } finally {
      setIsCreating(false);
    }
  }, [user, clientId, clientDoc, apiClient, addLog, router, refreshSessions, visitDate, sessionType]);


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
        <p className="w-full md:w-auto text-base md:text-lg font-semibold">Interactions avec {clientDoc?.name || clientId}</p>
        <Button asChild className="w-full md:w-auto h-10 px-4 rounded-full bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white">
          <Link href="/clients"><PanelRightOpenSolid className="mr-2" />Retour aux clients</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-4">
        {/* Démarrer / lister */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Démarrer une interaction</CardTitle>
              <CardDescription>Choisissez le type d&apos;interaction et la date, puis lancez la session.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
                  <Select value={sessionType} onValueChange={setSessionType}>
                    <SelectTrigger className="h-10 px-4 gap-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white text-sm w-full justify-center">
                      <SelectValue placeholder="Type d&apos;interaction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Sélectionnez le type d&apos;interaction</SelectLabel>
                        <SelectItem value="avec_client">Interaction clients (Agrilink)</SelectItem>
                        <SelectItem value="parcelle_seule">Observation de parcelle (FieldEye)</SelectItem>
                        <SelectItem value="exploitation_sans_client">Suivi d&apos;exploitation (FarmScope)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id="visit-date"
                        variant="default"
                        className={cn('h-10 px-4 gap-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white text-sm w-full justify-center')}
                      >
                        <CalendarDownSolid className="h-4 w-4" />
                        {visitDate ? format(visitDate, 'dd/MM/yyyy') : 'Sélectionnez une date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 overflow-hidden" align="start">
                      <Calendar
                        mode="single"
                        selected={visitDate}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setVisitDate(date ?? undefined);
                          if (date) setIsDatePickerOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                 <Button
                   className="h-10 px-5 gap-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white text-sm w-auto"
                   disabled={isCreating || !visitDate || !sessionType}
                   onClick={startVisit}
                 >
                   {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChatPlusSolid />}
                   {isCreating ? 'Démarrage…' : "Commencer l'interaction"}
                 </Button>
               </div>
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle>Vos interactions</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-3">
                <div className="flex justify-center">
                  <Button className="h-10 px-5 gap-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white text-sm w-auto" disabled={isListing} onClick={refreshSessions}>
                    {isListing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshAltSolid />}
                    {isListing ? 'Chargement…' : 'Actualiser la liste'}
                  </Button>
                </div>

                <div className="space-y-2">
                  {Array.isArray(firestoreSessions) && firestoreSessions.length > 0 ? (
                    firestoreSessions.map((s) => {
                      const isGenerating = generatingSessions.has(s.id);
                      // Calculate elapsed time for generating sessions
                      let elapsedText = '';
                      if (isGenerating) {
                        const timestampStr = localStorage.getItem(`generating-report-${s.id}`);
                        if (timestampStr) {
                          const timestamp = parseInt(timestampStr, 10);
                          const elapsed = Math.floor((Date.now() - timestamp) / 1000);
                          const minutes = Math.floor(elapsed / 60);
                          const seconds = elapsed % 60;
                          elapsedText = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
                        }
                      }
                      
                      return (
                      <div
                        key={s.id}
                        className={cn(
                          "flex items-center justify-between rounded-md border px-3 py-3 gap-3 md:gap-2 min-h-14 md:min-h-12 outline-none select-none",
                          isGenerating ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-accent/40 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        )}
                        role="button"
                        tabIndex={isGenerating ? -1 : 0}
                        onClick={() => !isGenerating && handleGoToSession(s.id)}
                        onKeyDown={(e) => { if (!isGenerating && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); handleGoToSession(s.id); } }}
                        aria-label={`Ouvrir la session ${s.id}`}
                        aria-disabled={isGenerating}
                      >
                        <div className="min-w-0 flex items-center gap-2">
                          {isGenerating && <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />}
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">{displayLabelsById[s.id]?.title || clientDoc?.name || s.id}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {isGenerating ? `Génération du rapport en cours… (${elapsedText})` : (displayLabelsById[s.id]?.subtitle ?? (reportReadyById[s.id] ? 'Rapport disponible' : 'En cours…'))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 md:gap-2" role="group" aria-label="Actions de session">
                          {reportReadyById[s.id] && !s.saved && !isGenerating && (
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
                            disabled={isGenerating}
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
                            disabled={isGenerating}
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!user) return;
                              const ok = window.confirm('Supprimer cette interaction ?');
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
                    );})
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucune interaction. Cliquez sur « Actualiser ».</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bouton Ouvrir AgriDesk */}
      <div className="flex justify-center mt-6">
        <Button
          size="lg"
          className="inline-flex items-center justify-center h-12 px-6 gap-2 rounded-full text-base"
          onClick={() => router.push(`/assistant/google?clientId=${clientId}`)}
        >
          <BubblesSolid />
          <span>Ouvrir AgriDesk</span>
        </Button>
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