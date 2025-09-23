import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage, useApiClient } from './hooks';
import type { Config } from './types';

describe('useLocalStorage', () => {
  const KEY = 'test-key';

  beforeEach(() => {
    window.localStorage.clear();
  });

  test('initializes with default and persists updates', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 1));
    expect(result.current[0]).toBe(1);
    act(() => result.current[1](2));
    expect(result.current[0]).toBe(2);
    expect(JSON.parse(window.localStorage.getItem(KEY) || 'null')).toBe(2);
  });

  test('reads existing value from localStorage', () => {
    window.localStorage.setItem(KEY, JSON.stringify(42));
    const { result } = renderHook(() => useLocalStorage(KEY, 1));
    expect(result.current[0]).toBe(42);
  });
});

describe('useApiClient', () => {
  const cfg: Config = { scheme: 'wss', host: 'x', port: '0', appName: 'app', userId: 'u', sessionId: 's' };
  const addLog = vi.fn();
  const fetchSpy = vi.spyOn(globalThis, 'fetch');

  beforeEach(() => {
    addLog.mockClear();
    fetchSpy.mockReset();
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL = 'https://example.com';
  });

  afterEach(() => {
    fetchSpy.mockReset();
  });

  test('createSession success logs and returns data', async () => {
    fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, id: 'abc' }), { status: 200 }));
    const { result } = renderHook(() => useApiClient(cfg, addLog));
    const data = await result.current.createSession({ foo: 'bar' });
    expect(data).toEqual({ ok: true, id: 'abc' });
    expect(addLog).toHaveBeenCalledWith(expect.stringMatching(/HTTP|Http/i), expect.stringMatching(/Success/), { ok: true, id: 'abc' });
  });

  test('getSession error logs and returns null', async () => {
    fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify({ error: 'nope' }), { status: 500 }));
    const { result } = renderHook(() => useApiClient(cfg, addLog));
    const data = await result.current.getSession('zzz');
    expect(data).toBeNull();
    expect(addLog).toHaveBeenCalled();
  });
});


