import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { buildHttpUrl, buildWsUrl, arrayBufferToBase64, base64ToUint8Array } from './utils';
import type { Config } from './types';

describe('URL builders', () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  test('buildHttpUrl throws when env missing', () => {
    const cfg: Config = { scheme: 'ws', host: 'localhost', port: '8080', appName: 'app', userId: 'u', sessionId: '' };
    expect(() => buildHttpUrl(cfg)).toThrow(/NEXT_PUBLIC_BACKEND_BASE_URL manquant/);
  });

  test('buildHttpUrl uses NEXT_PUBLIC_BACKEND_BASE_URL and trims trailing slash', () => {
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL = 'http://localhost:8080/';
    const cfg: Config = { scheme: 'ws', host: 'localhost', port: '8080', appName: 'app', userId: 'u', sessionId: '' };
    expect(buildHttpUrl(cfg)).toBe('http://localhost:8080');
  });

  test('buildWsUrl builds ws URL from http base', () => {
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL = 'http://localhost:8080';
    const cfg: Config = { scheme: 'ws', host: 'ignored', port: 'ignored', appName: 'app', userId: 'u', sessionId: 's' };
    expect(buildWsUrl(cfg)).toBe('ws://localhost:8080/apps/app/users/u/sessions/s/ws?is_audio=true');
  });

  test('buildWsUrl builds wss URL from https base', () => {
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL = 'https://example.com';
    const cfg: Config = { scheme: 'wss', host: 'ignored', port: 'ignored', appName: 'app', userId: 'u', sessionId: 's' };
    expect(buildWsUrl(cfg)).toBe('wss://example.com/apps/app/users/u/sessions/s/ws?is_audio=true');
  });
});

describe('base64 helpers', () => {
  test('arrayBufferToBase64 and base64ToUint8Array round-trip', () => {
    const bytes = new Uint8Array([0, 1, 2, 250, 251, 252, 253, 254, 255]);
    const b64 = arrayBufferToBase64(bytes.buffer);
    const out = base64ToUint8Array(b64);
    expect(Array.from(out)).toEqual(Array.from(bytes));
  });
});

