"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogIn, UserPlus } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-6 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Bienvenue sur IAdvisor</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Connectez‑vous pour continuer ou créez un nouveau compte.
        </p>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Button size="lg" asChild>
          <Link href="/auth/signin">
            <LogIn className="mr-2 h-4 w-4" /> Se connecter
          </Link>
        </Button>
        <Button size="lg" variant="secondary" asChild>
          <Link href="/auth/signup">
            <UserPlus className="mr-2 h-4 w-4" /> Créer un compte
          </Link>
        </Button>
      </div>
    </div>
  );
}