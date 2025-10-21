"use client";
import React, { useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Session, SessionDetails, Result, ClientRecord } from '@/lib/types';
import { LogLevel } from '@/lib/types';
import { useApiClient } from '@/lib/hooks';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthProvider';
import { getClientById, listSessionsForClient, updateClientSessionDoc, deleteClientSessionDoc } from '@/lib/firebase';
import { BookOpenSolid, RefreshAltSolid, TrashOneSolid, BookImageSolid, TelephoneSolid, BookmarkSolid } from '@mynaui/icons-react';

type ClientDoc = Pick<ClientRecord, 'id' | 'name' | 'email' | 'contexte'>;

function SessionsListPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, loading } = useAuth();

  const clientId = typeof window !== 'undefined' ? (params?.get('clientId') || '') : '';

  const [isListing, setIsListing] = React.useState(false);
  const [firestoreSessions, setFirestoreSessions] = React.useState<Array<{ id: string; name?: string; is_report_done?: boolean; saved?: boolean }>>([]);
  const [reportReadyById, setReportReadyById] = React.useState<Record<string, boolean>>({});
  const [displayLabelsById, setDisplayLabelsById] = React.useState<Record<string, { title: string; subtitle?: string }>>({});
  const [generatingSessions, setGeneratingSessions] = React.useState<Set<string>>(new Set());
  const [clientDoc, setClientDoc] = React.useState<ClientDoc | null>(null);

  // Check localStorage for generating sessions with timeout detection
  const checkGeneratingSessions = useCallback(() => {
    const generating = new Set<string>();
    const now = Date.now();
    const TIMEOUT_MS = 7 * 60 * 1000; // 7 minutes timeout
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('generating-report-')) {
        const sessionId = key.replace('generating-report-', '');
        const timestampStr = localStorage.getItem(key);
        
        if (timestampStr) {
          const timestamp = parseInt(timestampStr, 10);
          const elapsed = now - timestamp;
          
          if (elapsed > TIMEOUT_MS) {
            console.warn(`Report generation for session ${sessionId} timed out after ${Math.round(elapsed / 1000)}s. Cleaning up.`);
            localStorage.removeItem(key);
          } else {
            generating.add(sessionId);
          }
        } else {
          localStorage.removeItem(key);
        }
      }
    }
    setGeneratingSessions(generating);
  }, []);

  React.useEffect(() => {
    checkGeneratingSessions();
    const interval = setInterval(checkGeneratingSessions, 2000);
    return () => clearInterval(interval);
  }, [checkGeneratingSessions]);

  React.useEffect(() => {
    if (!loading && !user) router.replace('/welcome');
  }, [loading, user, router]);

  const addLog = useCallback((level: LogLevel, message: string, data?: unknown) => {
    if (process.env.NODE_ENV !== 'production') {
      try { console.debug(`[${level}] ${message}`, data ?? ''); } catch {}
    }
  }, []);

  const apiClient = useApiClient({
    scheme: (typeof window !== 'undefined' && window.location.protocol === 'https:') ? 'wss' : 'ws',
    host: 'env',
    port: '0',
    appName: 'app',
    userId: clientId || 'user',
    sessionId: ''
  }, addLog);

  const getSessionRef = React.useRef<(id: string) => Promise<Result<SessionDetails>>>(async () => ({ ok: false, error: new Error('not initialized') }));
  React.useEffect(() => { getSessionRef.current = apiClient.getSession; }, [apiClient]);
  const listSessionsRef = React.useRef<() => Promise<Result<Session[]>>>(async () => ({ ok: false, error: new Error('not initialized') }));
  React.useEffect(() => { listSessionsRef.current = apiClient.listSessions; }, [apiClient]);

  const refreshSessions = useCallback(async () => {
    if (!user || !clientId) {
      setFirestoreSessions([]);
      setClientDoc(null);
      return;
    }
    setIsListing(true);
    try {
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

  // Listen for localStorage changes to detect when generation completes
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('generating-report-') && e.oldValue && !e.newValue) {
        setTimeout(() => {
          checkGeneratingSessions();
          void refreshSessions();
        }, 500);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkGeneratingSessions, refreshSessions]);

  const handleResumeCall = (sessionId: string) => { 
    router.push(`/workspace/sessions/live/${sessionId}?clientId=${clientId}`);
  };

  const handleViewReport = (sessionId: string) => { 
    router.push(`/workspace/sessions/report/${sessionId}?clientId=${clientId}`);
  };

  const handleFinalizeSession = async (sessionId: string) => {
    if (!user?.uid || !clientId) return;
    
    const generatingKey = `generating-report-${sessionId}`;
    const timestamp = Date.now();
    localStorage.setItem(generatingKey, timestamp.toString());
    
    setGeneratingSessions(prev => new Set(prev).add(sessionId));
    
    try {
      const clientDoc = await getClientById(user.uid, clientId);
      const response = await apiClient.generateReport(sessionId, {
        ville: clientDoc?.city ?? null,
        zip_code: clientDoc?.zipCode ?? null,
        current_document_path: `technico/${user.uid}/clients/${clientId}/sessions/${sessionId}`,
      });

      if (response.ok && (response.value as { result?: unknown })?.result) {
        const structured = (response.value as { result: unknown }).result as Record<string, unknown>;
        if (structured && typeof structured === 'object' && 'main_report' in structured && 'strategic_dashboard' in structured) {
          await updateClientSessionDoc(user.uid, clientId, sessionId, {
            ReportKey: structured,
            is_report_done: true,
          });
          void refreshSessions();
        }
      }
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      localStorage.removeItem(generatingKey);
      setGeneratingSessions(prev => {
        const next = new Set(prev);
        next.delete(sessionId);
        return next;
      });
    }
  };

  if (loading || !user) {
    return <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center text-sm text-muted-foreground">Chargement…</div>;
  }
  
  if (!clientId) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center text-sm text-muted-foreground">
        Aucun client sélectionné.
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col gap-6 p-6 md:py-12">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Historique</p>
        <h1 className="text-3xl font-semibold">Interactions avec {clientDoc?.name || clientId}</h1>
        <p className="text-sm text-muted-foreground">
          Consultez toutes vos sessions enregistrées.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vos interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-center">
              <Button 
                className="h-10 px-5 gap-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white text-sm w-auto" 
                disabled={isListing} 
                onClick={refreshSessions}
              >
                {isListing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshAltSolid />}
                {isListing ? 'Chargement…' : 'Actualiser la liste'}
              </Button>
            </div>

            <div className="space-y-2">
              {Array.isArray(firestoreSessions) && firestoreSessions.length > 0 ? (
                firestoreSessions.map((s) => {
                  const isGenerating = generatingSessions.has(s.id);
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
                        "flex items-center justify-between rounded-md border px-3 py-3 gap-3 md:gap-2 min-h-14 md:min-h-12"
                      )}
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
                        {!reportReadyById[s.id] ? (
                          <>
                            {/* Buttons for non-finalized sessions */}
                            <Button
                              size="icon"
                              variant="default"
                              aria-label="Reprendre l'appel"
                              title="Reprendre l'appel"
                              className="size-11 md:size-9 p-0 rounded-full bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white flex items-center justify-center"
                              disabled={isGenerating}
                              onClick={(e) => { e.stopPropagation(); handleResumeCall(s.id); }}
                            >
                              <TelephoneSolid className="size-5 md:size-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="default"
                              aria-label="Finaliser"
                              title="Finaliser l'interaction"
                              className="size-11 md:size-9 p-0 rounded-full bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white flex items-center justify-center"
                              disabled={isGenerating}
                              onClick={(e) => { e.stopPropagation(); handleFinalizeSession(s.id); }}
                            >
                              <BookmarkSolid className="size-5 md:size-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            {/* Buttons for finalized sessions */}
                            {!s.saved && !isGenerating && (
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
                              aria-label="Lire le rapport"
                              title="Lire le rapport"
                              className="size-11 md:size-9 p-0 rounded-full bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white flex items-center justify-center"
                              disabled={isGenerating}
                              onClick={(e) => { e.stopPropagation(); handleViewReport(s.id); }}
                            >
                              <BookOpenSolid className="size-5 md:size-4" />
                            </Button>
                          </>
                        )}
                        
                        {/* Delete button - always shown */}
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
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">Aucune interaction. Cliquez sur « Actualiser ».</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SessionsListPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center text-sm text-muted-foreground">Chargement…</div>}>
      <SessionsListPageInner />
    </Suspense>
  );
}

