"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { getFirebaseAuth, ensureUserInitialized, getGoogleProvider } from '@/lib/firebase';
import { createUserWithEmailAndPassword, getAdditionalUserInfo, signInWithPopup } from 'firebase/auth';

export default function SignUpPage() {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && user) {
      router.push('/clients');
    }
  }, [user, loading, router]);

  const onSignUp = async () => {
    try {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error('Authentification non initialisée');
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const u = cred.user;
      await ensureUserInitialized(
        { uid: u.uid, email: u.email, displayName: `${firstName} ${lastName}` },
        { nameOverride: `${firstName} ${lastName}` }
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(`Erreur: ${message || 'Impossible de créer le compte'}`);
    }
  };

  const onGoogle = async () => {
    try {
      const auth = getFirebaseAuth();
      const provider = getGoogleProvider();
      if (!auth || !provider) throw new Error('Authentification non initialisée');
      const result = await signInWithPopup(auth, provider);
      const info = getAdditionalUserInfo(result);
      if (info?.isNewUser) {
        const u = result.user;
        await ensureUserInitialized({ uid: u.uid, email: u.email, displayName: u.displayName, photoURL: u.photoURL });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(`Erreur: ${message || 'Impossible de créer le compte avec Google'}`);
    }
  };

  if (loading || user) {
    return <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">Chargement…</div>;
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Créer un compte</CardTitle>
          <CardDescription>Renseignez vos informations pour créer un compte</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">Prénom</Label>
                <Input id="first-name" placeholder="Max" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Nom</Label>
                <Input id="last-name" placeholder="Robinson" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E‑mail</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="button" className="w-full" onClick={onSignUp}>
              Créer le compte
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={onGoogle}>
              Continuer avec Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Vous avez déjà un compte ?{' '}
            <Link href="/auth/signin" className="underline">
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}