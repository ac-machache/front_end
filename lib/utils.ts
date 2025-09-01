import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Config } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// URL helpers
export function buildHttpUrl(config: Config): string {
  // If host is localhost, use the Next.js proxy.
  if (config.host === 'localhost') {
    return '/api';
  }
  // Otherwise, build the full URL for cloud environments.
  const protocol = config.scheme === 'wss' ? 'https' : 'http';
  const port = (protocol === 'https' && config.port === '443') || (protocol === 'http' && config.port === '80') ? '' : `:${config.port}`;
  return `${protocol}://${config.host}${port}`;
}

export function buildWsUrl(config: Config): string {
  // If host is localhost, use the Next.js proxy for WebSocket.
  if (config.host === 'localhost') {
    const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = typeof window !== 'undefined' ? window.location.host : ''; // This will be the ngrok host
    return `${protocol}://${host}/api/apps/${config.appName}/users/${config.userId}/sessions/${config.sessionId}/ws?is_audio=true`;
  }
  // Otherwise, build the full URL for cloud environments.
  const port = (config.scheme === 'wss' && config.port === '443') || (config.scheme === 'ws' && config.port === '80') ? '' : `:${config.port}`;
  return `${config.scheme}://${config.host}${port}/apps/${config.appName}/users/${config.userId}/sessions/${config.sessionId}/ws?is_audio=true`;
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
