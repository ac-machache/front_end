import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Config } from './types'

function env(name: string, fallback = ''): string {
  if (typeof process !== 'undefined' && process.env && process.env[name]) return process.env[name] as string;
  if (typeof window !== 'undefined' && (window as any).__ENV && (window as any).__ENV[name]) return (window as any).__ENV[name] as string;
  return fallback;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// URL helpers
function sanitizeHost(host: string): string {
  // Strip protocol and any trailing path or slash
  const noProto = host.replace(/^https?:\/\//i, '');
  return noProto.split('/')[0].trim();
}

export function buildHttpUrl(config: Config): string {
  // Prefer env-configured base URL if present
  const base = env('NEXT_PUBLIC_BACKEND_BASE_URL');
  if (base) return base.replace(/\/$/, '');
  // Fallback to proxy
  return '/api';
}

export function buildWsUrl(config: Config): string {
  const base = env('NEXT_PUBLIC_BACKEND_BASE_URL');
  if (base) {
    const proto = base.startsWith('https') ? 'wss' : 'ws';
    const host = base.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `${proto}://${host}/apps/${config.appName}/users/${config.userId}/sessions/${config.sessionId}/ws?is_audio=true`;
  }
  // Fallback to proxy
  const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss' : 'ws';
  const host = typeof window !== 'undefined' ? window.location.host : '';
  return `${protocol}://${host}/api/apps/${config.appName}/users/${config.userId}/sessions/${config.sessionId}/ws?is_audio=true`;
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
