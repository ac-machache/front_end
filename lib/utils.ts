import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Config } from './types'

// (legacy) env helper no longer used for backend URL; kept for future optional flags
//

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// URL helpers
function getBackendBaseUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
    (typeof window !== 'undefined' && (window as unknown as { __ENV?: Record<string, string> }).__ENV?.NEXT_PUBLIC_BACKEND_BASE_URL) ||
    '';
  if (!base) {
    throw new Error('NEXT_PUBLIC_BACKEND_BASE_URL manquant. Définissez-le dans .env.local');
  }
  return base.replace(/\/$/, '');
}

export function buildHttpUrl(config: Config): string {
  void config; // avoid unused-arg lint
  return getBackendBaseUrl();
}

export function buildWsUrl(config: Config, options?: { resume?: boolean }): string {
  const base = getBackendBaseUrl();
  const proto = base.startsWith('https') ? 'wss' : 'ws';
  const host = base.replace(/^https?:\/\//, '').replace(/\/$/, '');

  const params = new URLSearchParams();
  params.set('is_audio', 'true');
  if (options?.resume) {
    params.set('resume', 'true');
  }

  return `${proto}://${host}/apps/${config.appName}/users/${config.userId}/sessions/${config.sessionId}/ws?${params.toString()}`;
}

// Unified URL builder for WebSocket connections (simplified for stateless sessions)
export function buildWebSocketUrl(sessionId: string, userId: string, options?: { isAudio?: boolean }): string {
  const base = getBackendBaseUrl();
  const proto = base.startsWith('https') ? 'wss' : 'ws';
  const host = base.replace(/^https?:\/\//, '').replace(/\/$/, '');

  const params = new URLSearchParams();
  if (options?.isAudio !== false) { // Default to true for audio
    params.set('is_audio', 'true');
  }

  return `${proto}://${host}/apps/app/users/${userId}/sessions/${sessionId}/ws?${params.toString()}`;
}

// base64 helpers
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}
