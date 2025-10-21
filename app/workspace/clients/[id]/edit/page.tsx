'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { getClientById, updateClientDoc } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircleSolid } from '@mynaui/icons-react';
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

export default function EditClientProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [client, setClient] = React.useState<ClientData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  
  // Form fields
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [city, setCity] = React.useState('');
  const [zipCode, setZipCode] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [contexte, setContexte] = React.useState('');

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
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone || '');
        setCity(data.city || '');
        setZipCode(data.zipCode || '');
        setAddress(data.address || '');
        setContexte(data.contexte || '');
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

  const handleSave = async () => {
    if (!user || !params.id) return;

    setIsSaving(true);
    try {
      await updateClientDoc(user.uid, params.id, {
        name,
        email,
        phone,
        city,
        zipCode,
        address,
        contexte,
      });

      // Update local state
      setClient((prev) => prev ? { ...prev, name, email, phone, city, zipCode, address, contexte } : null);
      
      alert('Profil mis à jour avec succès !');
      
      // Redirect to view page
      router.push(`/workspace/clients/${params.id}`);
    } catch (err) {
      console.error('Failed to update client:', err);
      alert('Échec de la mise à jour du profil');
    } finally {
      setIsSaving(false);
    }
  };

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
        <h1 className="text-2xl font-bold">Modifier le profil</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Modifiez les informations du client
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Nom du client"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">Code postal</Label>
            <Input
              id="zipCode"
              type="text"
              placeholder="75001"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              type="text"
              placeholder="Paris"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              type="text"
              placeholder="123 Rue de la Paix"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contexte">Contexte / Notes</Label>
          <Textarea
            id="contexte"
            placeholder="Informations complémentaires sur le client..."
            value={contexte}
            onChange={(e) => setContexte(e.target.value)}
            rows={6}
            className="resize-none"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={isSaving || !name.trim() || !email.trim()}
            className="gap-2 rounded-full px-6"
          >
            {isSaving ? (
              <>
                <Spinner variant="ellipsis" size={16} className="text-white" />
                Enregistrement...
              </>
            ) : (
              <>
                <CheckCircleSolid className="size-4" />
                Enregistrer les modifications
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

