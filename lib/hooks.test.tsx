import { describe, test, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useApiClient } from './hooks';

const cfg = { appName: 'test', userId: 'u1', sessionId: 's1', host: 'localhost', port: '8080', scheme: 'http' as const };
const addLog = vi.fn();

describe('useApiClient', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL = 'http://localhost:8080';
  });

  test('should initialize without errors', () => {
    const { result } = renderHook(() => useApiClient(cfg, addLog));
    expect(result.current.createSession).toBeDefined();
    expect(result.current.getSession).toBeDefined();
  });
});