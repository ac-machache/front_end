import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, doc, getDoc, setDoc, type Firestore, type DocumentData } from 'firebase/firestore';

type FirebaseWebConfig = {
  apiKey: string;
  authDomain?: string;
  projectId?: string;
  appId?: string;
};

let cachedApp: FirebaseApp | null = null;

function getConfigFromEnv(): FirebaseWebConfig | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn('Firebase not configured. Set NEXT_PUBLIC_FIREBASE_API_KEY and related env vars.');
    }
    return null;
  }
  return {
    apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null;
  if (cachedApp) return cachedApp;
  const cfg = getConfigFromEnv();
  if (!cfg) return null;
  cachedApp = getApps().length ? getApp() : initializeApp(cfg);
  return cachedApp;
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  const auth = getAuth(app);
  auth.languageCode = typeof navigator !== 'undefined' ? (navigator.language || 'en') : 'en';
  return auth;
}

export function getGoogleProvider(): GoogleAuthProvider | null {
  if (typeof window === 'undefined') return null;
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return provider;
}

// Firestore
export function getDb(): Firestore | null {
  const app = getFirebaseApp();
  if (!app) return null;
  return getFirestore(app);
}

export async function listClientsForUser(userId: string): Promise<DocumentData[]> {
  const db = getDb();
  if (!db) return [];
  const col = collection(db, 'users', userId, 'clients');
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

function pruneUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (v !== undefined) out[k] = v;
  }
  return out as Partial<T>;
}

export async function addClientForUser(userId: string, data: { name: string; email: string; notes?: string }): Promise<string | null> {
  const db = getDb();
  if (!db) return null;
  const col = collection(db, 'users', userId, 'clients');
  const payload = pruneUndefined({ ...data, createdAt: serverTimestamp() });
  const docRef = await addDoc(col, payload);
  return docRef.id ?? null;
}


// Ensure a user document exists and the clients subcollection is initialized
export type BasicUser = { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null };

export async function ensureUserInitialized(user: BasicUser, options?: { nameOverride?: string }): Promise<void> {
  const db = getDb();
  if (!db) return;
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, pruneUndefined({
      name: options?.nameOverride ?? user.displayName ?? null,
      email: user.email ?? null,
      photoURL: user.photoURL ?? null,
      createdAt: serverTimestamp(),
    }));
  }
  // No placeholder docs; Firestore initializes subcollections lazily
}

// --- Clients and Sessions helpers ---
export async function getClientById(userId: string, clientId: string): Promise<(DocumentData & { id: string }) | null> {
  const db = getDb();
  if (!db) return null;
  const clientRef = doc(db, 'users', userId, 'clients', clientId);
  const snap = await getDoc(clientRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as DocumentData & { id: string };
}

export async function listSessionsForClient(userId: string, clientId: string): Promise<DocumentData[]> {
  const db = getDb();
  if (!db) return [];
  const col = collection(db, 'users', userId, 'clients', clientId, 'sessions');
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Create/overwrite a session doc with backend sessionId as the Firestore doc id
export async function setClientSessionDoc(
  userId: string,
  clientId: string,
  sessionId: string,
  data: { nom_tc: string; nom_agri: string; is_report_done: boolean; ReportKey: string | null }
): Promise<void> {
  const db = getDb();
  if (!db) return;
  const ref = doc(db, 'users', userId, 'clients', clientId, 'sessions', sessionId);
  const payload = pruneUndefined({ ...data, createdAt: serverTimestamp() });
  await setDoc(ref, payload);
}

export async function updateClientSessionDoc(
  userId: string,
  clientId: string,
  sessionId: string,
  data: Partial<{ is_report_done: boolean; ReportKey: string | null }>
): Promise<void> {
  const db = getDb();
  if (!db) return;
  const ref = doc(db, 'users', userId, 'clients', clientId, 'sessions', sessionId);
  await setDoc(ref, pruneUndefined(data), { merge: true });
}


