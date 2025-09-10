"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import Image from 'next/image';
import { Moon, Sun } from 'lucide-react';

export default function AppNavbar() {
  const { user, signOut, loading } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  // Simple theme toggle (light/dark) using root .dark class
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => 'light');
  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial: 'light' | 'dark' = stored === 'dark' || (!stored && prefersDark) ? 'dark' : 'light';
      setTheme(initial);
      if (initial === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch {}
  }, []);
  const toggleTheme = React.useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        if (next === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        window.localStorage.setItem('theme', next);
      } catch {}
      return next;
    });
  }, []);

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60" suppressHydrationWarning>
      <div className="mx-auto max-w-6xl px-3 md:px-4 h-12 md:h-14 flex items-center justify-between gap-2 flex-wrap">
        <Link href="/clients" className="flex items-center gap-2 min-w-0">
          <Image src="/globe.svg" alt="logo" width={24} height={24} />
          <span className="font-semibold truncate">IAdvisor</span>
        </Link>
        <div className="flex items-center gap-2">
          {mounted && (
            <Button variant="ghost" size="icon" aria-label="Basculer le thème" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
          {mounted && !loading && user && (
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <Image src={user.photoURL} alt={user.displayName ?? 'User'} width={32} height={32} className="h-8 w-8 rounded-full" />
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


