'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { getClientById } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { PencilSolid } from '@mynaui/icons-react';
import { Spinner } from '@/components/ui/shadcn-io/spinner';

type ClientData = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  zipCode?: string;
  contexte?: string;
  address?: string;
};

export default function ClientProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [client, setClient] = React.useState<ClientData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      router.replace('/welcome');
    }
  }, [loading, user, router]);

  // Load client data
  React.useEffect(() => {
    if (!user || !params.id) return;

    let mounted = true;

    async function loadClient() {
      if (!user) return;
      try {
        const clientData = await getClientById(user.uid, params.id);
        if (!mounted || !clientData) return;

        const data: ClientData = {
          id: clientData.id,
          name: clientData.name || '',
          email: clientData.email || '',
          phone: clientData.phone || '',
          city: clientData.city || '',
          zipCode: clientData.zipCode || '',
          address: clientData.address || '',
          contexte: clientData.contexte || '',
        };

        setClient(data);
      } catch (err) {
        console.error('Failed to load client:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadClient();

    return () => {
      mounted = false;
    };
  }, [user, params.id]);

  if (loading || isLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <Spinner variant="ellipsis" size={32} />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-sm text-muted-foreground">Client introuvable</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profil du client</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Consultez les informations du client
        </p>
      </div>

      {/* Profile Information */}
      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Nom complet</div>
            <div className="text-base">{client.name || '—'}</div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Email</div>
            <div className="text-base">{client.email || '—'}</div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Téléphone</div>
            <div className="text-base">{client.phone || '—'}</div>
          </div>

          {/* Zip Code */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Code postal</div>
            <div className="text-base">{client.zipCode || '—'}</div>
          </div>

          {/* City */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Ville</div>
            <div className="text-base">{client.city || '—'}</div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Adresse</div>
            <div className="text-base">{client.address || '—'}</div>
          </div>
        </div>

        {/* Context / Notes */}
        <div className="space-y-2 pt-4 border-t">
          <div className="text-sm font-medium text-muted-foreground">Contexte / Notes</div>
          <div className="text-base whitespace-pre-wrap">{client.contexte || '—'}</div>
        </div>

        {/* Modifier Button at Bottom Right */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            variant="default"
            className="gap-2 rounded-full px-6"
            onClick={() => router.push(`/workspace/clients/${params.id}/edit`)}
          >
            <PencilSolid className="size-4" />
            Modifier le profil
          </Button>
        </div>
      </div>
    </div>
  );
}
