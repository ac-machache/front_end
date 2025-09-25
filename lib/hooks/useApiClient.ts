"use client";
import { useCallback } from 'react';
import type { Config, Result, Session, SessionDetails } from '../types';
import { LogLevel } from '../types';
import { buildHttpUrl } from '../utils';

export function useApiClient(config: Config, addLog: (level: LogLevel, message: string, data?: unknown) => void) {
  const baseUrl = buildHttpUrl(config);
  const performRequest = useCallback(async <T,>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<Result<T>> => {
    const url = `${baseUrl}${path}`;
    addLog(LogLevel.Http, `${method} ${url}`, body);
    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      if (!response.ok) {
        const err = new Error(`HTTP ${response.status}`) as Error & { cause?: unknown };
        err.cause = data;
        throw err;
      }
      addLog(LogLevel.Http, `Success: ${response.status}`, data);
      return { ok: true, value: data };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const cause = (error as { cause?: unknown })?.cause ?? error;
      addLog(LogLevel.Error, message, cause);
      return { ok: false, error: new Error(message, { cause }) };
    }
  }, [baseUrl, addLog]);

  return {
    createSession: (initialState?: Record<string, unknown>) => performRequest<Session>('POST', `/apps/${config.appName}/users/${config.userId}/sessions`, initialState),
    createSessionWithId: (sessionId: string, initialState?: Record<string, unknown>) => performRequest<Session>('POST', `/apps/${config.appName}/users/${config.userId}/sessions/${sessionId}`, initialState),
    listSessions: () => performRequest<Session[]>('GET', `/apps/${config.appName}/users/${config.userId}/sessions`),
    getSession: (sessionId: string) => performRequest<SessionDetails>('GET', `/apps/${config.appName}/users/${config.userId}/sessions/${sessionId}`),
    deleteSession: (sessionId: string) => performRequest('POST', `/apps/${config.appName}/users/${config.userId}/sessions/${sessionId}/delete`),
    ingestSessionMemoryFor: (sessionId: string, returnContext: boolean = false) =>
      performRequest('POST', `/apps/${config.appName}/users/${config.userId}/sessions/${sessionId}/ingest?return_context=${returnContext ? 'true' : 'false'}`),
  };
}