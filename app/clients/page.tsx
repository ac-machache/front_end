"use client";
import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addClientForUser, listClientsForUser } from '@/lib/firebase';
import type { ClientRecord } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlusSolid, RefreshAltSolid, ListSolid } from '@mynaui/icons-react';

export default function ClientsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  React.useEffect(() => {
    if (!loading && !user) router.replace('/welcome');
  }, [loading, user, router]);
  const [clients, setClients] = React.useState<ClientRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAdding, setIsAdding] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [newEmail, setNewEmail] = React.useState('');
  const [newNotes, setNewNotes] = React.useState('');

  const refresh = React.useCallback(async () => {
    if (!user) { setClients([]); return; }
    setIsLoading(true);
    try {
      const list = await listClientsForUser(user.uid);
      const sanitized = (list as ClientRecord[]);
      setClients(sanitized);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  React.useEffect(() => { refresh(); }, [refresh]);

  const onAdd = async () => {
    if (!user || !newName.trim()) return;
    setIsAdding(true);
    try {
      await addClientForUser(user.uid, { name: newName.trim(), email: newEmail.trim(), notes: newNotes.trim() || undefined });
      setNewName('');
      setNewEmail('');
      setNewNotes('');
      await refresh();
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center text-sm text-muted-foreground">Chargement…</div>;
  }
  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center text-sm text-muted-foreground">
        Veuillez <Link href="/auth/signin" className="underline ml-1">vous connecter</Link> pour gérer vos clients.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-col sm:flex-row">
        <h1 className="text-xl md:text-2xl font-semibold">Vos clients</h1>
        <Button variant="default" onClick={refresh} disabled={isLoading} className="w-full sm:w-auto rounded-full h-10 px-4 gap-2">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshAltSolid />}
          Actualiser
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un client</CardTitle>
          <CardDescription>Créez un client pour organiser vos visites.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-1">
              <Label htmlFor="clientName">Nom</Label>
              <Input id="clientName" value={newName} onChange={(e) => setNewName(e.target.value)} className="mt-1" placeholder="Nom du client" />
            </div>
            <div className="md:col-span-1">
              <Label htmlFor="clientEmail">E‑mail</Label>
              <Input id="clientEmail" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="mt-1" placeholder="client@email.com" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="clientNotes">Notes</Label>
              <Input id="clientNotes" value={newNotes} onChange={(e) => setNewNotes(e.target.value)} className="mt-1" placeholder="Notes (optionnel)" />
            </div>
            <div className="md:col-span-3">
              <Button onClick={onAdd} disabled={isAdding || !newName.trim() || !newEmail.trim()} className="w-full sm:w-auto rounded-full h-10 px-4 gap-2">
                {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlusSolid />}
                Ajouter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clients.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle>{c.name}</CardTitle>
              <CardDescription>{c.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">{c.notes || '—'}</div>
            </CardContent>
            <CardFooter>
              <Button asChild size="sm" className="rounded-full h-9 px-3 gap-2">
                <Link href={`/session?clientId=${c.id}`}><ListSolid /> Voir les visites</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        {clients.length === 0 && !isLoading && (
          <div className="text-sm text-muted-foreground">Aucun client pour l’instant. Ajoutez‑en un ci‑dessus.</div>
        )}
      </div>
    </div>
  );
}