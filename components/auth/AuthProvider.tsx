"use client";
import React from 'react';
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, setPersistence, browserLocalPersistence, signOut as firebaseSignOut, type User } from 'firebase/auth';
import { getFirebaseAuth, getGoogleProvider, ensureUserInitialized } from '@/lib/firebase';

export type AuthUser = {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

function toAuthUser(u: User | null): AuthUser | null {
  if (!u) return null;
  return { uid: u.uid, displayName: u.displayName, email: u.email, photoURL: u.photoURL };
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) { setLoading(false); return; }
    setPersistence(auth, browserLocalPersistence).catch(() => {});
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(toAuthUser(u));
      setLoading(false);
      if (u) {
        // Ensure Firestore user doc and clients placeholder exist
        ensureUserInitialized({ uid: u.uid, email: u.email, displayName: u.displayName, photoURL: u.photoURL }).catch(() => {});
      }
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = React.useCallback(async () => {
    const auth = getFirebaseAuth();
    const provider = getGoogleProvider();
    if (!auth || !provider) return;
    try {
      const cred = await signInWithPopup(auth, provider);
      const u = cred.user;
      await ensureUserInitialized({ uid: u.uid, email: u.email, displayName: u.displayName, photoURL: u.photoURL });
    } catch {
      await signInWithRedirect(auth, provider);
    }
  }, []);

  const signOut = React.useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await firebaseSignOut(auth);
  }, []);

  const value = React.useMemo<AuthContextValue>(() => ({ user, loading, signInWithGoogle, signOut }), [user, loading, signInWithGoogle, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


