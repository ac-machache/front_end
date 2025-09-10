"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';

export default function AppNavbar() {
  const { user, signOut, loading } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60" suppressHydrationWarning>
      <div className="mx-auto max-w-6xl px-3 md:px-4 h-12 md:h-14 flex items-center justify-between gap-2 flex-wrap">
        <Link href="/clients" className="flex items-center gap-2 min-w-0">
          <img src="/globe.svg" alt="logo" className="h-6 w-6" />
          <span className="font-semibold truncate">IAdvisor</span>
        </Link>
        <div className="flex items-center gap-2">
          {mounted && !loading && user && (
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName ?? 'User'} className="h-8 w-8 rounded-full" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  {(user.displayName || user.email || 'U').slice(0, 1).toUpperCase()}
                </div>
              )}
              <Button variant="secondary" size="sm" onClick={signOut}>Se déconnecter</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


