import { describe, test, expect } from 'vitest';
import { buildHttpUrl, buildWsUrl } from './utils';
import type { Config } from './types';

describe('URL builders', () => {
  test('buildHttpUrl uses /api for localhost', () => {
    const cfg: Config = { scheme: 'ws', host: 'localhost', port: '8080', appName: 'app', userId: 'u', sessionId: '' };
    expect(buildHttpUrl(cfg)).toBe('/api');
  });

  test('buildHttpUrl builds absolute for cloud', () => {
    const cfg: Config = { scheme: 'wss', host: 'example.com', port: '443', appName: 'app', userId: 'u', sessionId: '' };
    expect(buildHttpUrl(cfg)).toBe('https://example.com');
  });

  test('buildWsUrl uses proxy for localhost', () => {
    const cfg: Config = { scheme: 'ws', host: 'localhost', port: '8080', appName: 'app', userId: 'u', sessionId: 's' };
    const url = buildWsUrl(cfg);
    expect(url.includes('/api/apps/app/users/u/sessions/s/ws')).toBe(true);
  });

  test('buildWsUrl builds absolute for cloud', () => {
    const cfg: Config = { scheme: 'wss', host: 'example.com', port: '443', appName: 'app', userId: 'u', sessionId: 's' };
    expect(buildWsUrl(cfg)).toBe('wss://example.com/apps/app/users/u/sessions/s/ws?is_audio=true');
  });
});

