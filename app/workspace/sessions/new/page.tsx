"use client";
import React, { useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ClientRecord } from '@/lib/types';
import { LogLevel } from '@/lib/types';
import { useApiClient } from '@/lib/hooks';
import { Loader2 } from 'lucide-react';
import { CalendarDownSolid, ChatPlusSolid } from '@mynaui/icons-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useAuth } from '@/components/auth/AuthProvider';
import { getClientById, setClientSessionDoc } from '@/lib/firebase';

type ClientDoc = Pick<ClientRecord, 'id' | 'name' | 'email' | 'contexte'>;

function NewSessionPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, loading } = useAuth();

  const clientId = typeof window !== 'undefined' ? (params?.get('clientId') || '') : '';

  const [isCreating, setIsCreating] = React.useState(false);
  const [visitDate, setVisitDate] = React.useState<Date | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const [sessionType, setSessionType] = React.useState<string>('');
  const [clientDoc, setClientDoc] = React.useState<ClientDoc | null>(null);

  React.useEffect(() => {
    if (!loading && !user) router.replace('/welcome');
  }, [loading, user, router]);

  // Load client data
  React.useEffect(() => {
    let mounted = true;
    if (!user || !clientId) return;

    async function loadClient() {
      if (!user) return;
      try {
        const c = await getClientById(user.uid, clientId);
        if (mounted && c) {
          setClientDoc({
            id: c.id,
            name: typeof c.name === 'string' ? c.name : '',
            email: typeof c.email === 'string' ? c.email : '',
            contexte: typeof c.contexte === 'string' ? c.contexte : '',
          });
        }
      } catch {}
    }

    loadClient();
    return () => { mounted = false; };
  }, [user, clientId]);

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
        setClientSessionDoc(
          user.uid,
          clientId,
          result.value.id,
          { nom_tc, nom_agri, is_report_done: false, ReportKey: null }
        )
          .then(() => {})
          .catch((err) => { addLog(LogLevel.Error, 'Failed to persist session to Firestore', err); });
        
        router.push(`/workspace/sessions/live/${result.value.id}?clientId=${clientId}`);
        setVisitDate(undefined);
        setSessionType('');
      }
    } finally {
      setIsCreating(false);
    }
  }, [user, clientId, clientDoc, apiClient, addLog, router, visitDate, sessionType]);

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
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Nouvelle interaction</p>
        <h1 className="text-3xl font-semibold">Démarrer une session avec {clientDoc?.name || clientId}</h1>
        <p className="text-sm text-muted-foreground">
          Choisissez le type d&apos;interaction et la date, puis lancez la session.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration de la session</CardTitle>
          <CardDescription>Sélectionnez les paramètres pour votre interaction.</CardDescription>
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
    </div>
  );
}

export default function NewSessionPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center text-sm text-muted-foreground">Chargement…</div>}>
      <NewSessionPageInner />
    </Suspense>
  );
}

