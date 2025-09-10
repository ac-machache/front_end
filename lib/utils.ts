import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Config } from './types'

// (legacy) env helper no longer used for backend URL; kept for future optional flags
//

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// URL helpers
// function sanitizeHost(host: string): string {
//   const noProto = host.replace(/^https?:\/\//i, '');
//   return noProto.split('/')[0].trim();
// }

export function buildHttpUrl(config: Config): string {
  void config; // avoid unused-arg lint
  const base =
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
    (typeof window !== 'undefined' && (window as unknown as { __ENV?: Record<string, string> }).__ENV?.NEXT_PUBLIC_BACKEND_BASE_URL) ||
    '';
  if (!base) {
    throw new Error('NEXT_PUBLIC_BACKEND_BASE_URL manquant. Définissez-le dans .env.local');
  }
  return base.replace(/\/$/, '');
}

export function buildWsUrl(config: Config): string {
  const base =
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
    (typeof window !== 'undefined' && (window as unknown as { __ENV?: Record<string, string> }).__ENV?.NEXT_PUBLIC_BACKEND_BASE_URL) ||
    '';
  if (!base) {
    throw new Error('NEXT_PUBLIC_BACKEND_BASE_URL manquant. Définissez-le dans .env.local');
  }
  const proto = base.startsWith('https') ? 'wss' : 'ws';
  const host = base.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return `${proto}://${host}/apps/${config.appName}/users/${config.userId}/sessions/${config.sessionId}/ws?is_audio=true`;
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
