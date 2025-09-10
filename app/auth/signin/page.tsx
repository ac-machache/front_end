"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth/AuthProvider';
import { getFirebaseAuth, getGoogleProvider } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && user) {
      router.push('/clients');
    }
  }, [user, loading, router]);

  const onEmailSignIn = async () => {
    try {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error('Authentification non initialisée');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(`Erreur: ${message || 'Impossible de se connecter'}`);
    }
  };

  const onGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch {
      const auth = getFirebaseAuth();
      const provider = getGoogleProvider();
      if (auth && provider) await signInWithPopup(auth, provider);
    }
  };

  if (loading || user) {
    return <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">Chargement…</div>;
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Se connecter</CardTitle>
          <CardDescription>Saisissez votre e‑mail pour accéder à votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E‑mail</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="button" className="w-full" onClick={onEmailSignIn}>
              Se connecter
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={onGoogle}>
              Continuer avec Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Pas de compte ?{' '}
            <Link href="/auth/signup" className="underline">
              Créer un compte
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}