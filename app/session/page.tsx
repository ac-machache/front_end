"use client";
import React, { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import type { Session, SessionDetails } from '@/lib/types';
import { LogLevel } from '@/lib/types';
import { useApiClient } from '@/lib/hooks';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function SessionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [apiResult, setApiResult] = useState<SessionDetails[] | null>(null);
  const [apiResultTitle, setApiResultTitle] = useState('Espace session');
  const [selectedSession, setSelectedSession] = useState<SessionDetails | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isListing, setIsListing] = useState(false);
  const [expandedReportSection, setExpandedReportSection] = useState<React.Key | null>('main_report');
  const [expandedStrategicSection, setExpandedStrategicSection] = useState<React.Key | null>('proactive_insights');
  const [reportReadyById, setReportReadyById] = useState<Record<string, boolean>>({});

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
    userId: user?.uid || 'user',
    sessionId: ''
  } as any, addLog);

  const handleApiResponse = (title: string, data: unknown) => {
    if (!data) return;
    setApiResultTitle(title);
    const maybeSessions = Array.isArray(data) ? (data as SessionDetails[]) : null;
    setApiResult(maybeSessions);
  };

  const handleGoToSession = (sessionId: string) => { router.push(`/session/${sessionId}`); };

  const refreshSessions = async () => {
    setIsListing(true);
    try {
      const data = await apiClient.listSessions();
      handleApiResponse('Session List', data);
      if (Array.isArray(data)) {
        const statusMap: Record<string, boolean> = {};
        for (const s of data as SessionDetails[]) {
          statusMap[s.id] = !!(s?.state && s.state.RapportDeSortie);
        }
        setReportReadyById(statusMap);
      } else if (data == null) {
        setApiResultTitle('Erreur API');
        setApiResult(null);
      }
    } finally {
      setIsListing(false);
    }
  };

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

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">IAdvisor</h1>
          <p className="text-muted-foreground">Gérez vos sessions.</p>
        </div>
        <Button variant="secondary" onClick={refreshSessions} disabled={isListing}>
          {isListing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Actualiser
        </Button>
      </div>
      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-12 md:col-span-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vos visites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-2">
                {Array.isArray(apiResult) && apiResult.length > 0 ? (
                  apiResult.map((s: SessionDetails) => (
                    <div key={s.id} className="flex items-center justify-between rounded-md border px-3 py-2 gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{s?.state?.RapportDeSortie?.main_report?.title || s.id}</div>
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
                  <p className="text-sm text-muted-foreground">Aucune visite. Cliquez sur "Actualiser".</p>
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
                    <Accordion expandedValue={expandedReportSection} onValueChange={setExpandedReportSection} className="space-y-3">
                      <AccordionItem value="main_report" className="rounded-md border">
                        <AccordionTrigger className="w-full text-left text-lg font-semibold px-4 py-3">Rapport principal</AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-3 border-t">
                          <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Titre :</span> {selectedSession.state.RapportDeSortie.main_report?.title}</div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-sm">La session n’est pas terminée. Aucun rapport.</div>
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


