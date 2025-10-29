"use client";
import { useCallback, useMemo } from 'react';
import type { Config, Result, Session, SessionDetails } from '../types';
import { LogLevel } from '../types';
import { buildHttpUrl } from '../utils';
import { getFirebaseAuth } from '../firebase';

export function useApiClient(config: Config, addLog: (level: LogLevel, message: string, data?: unknown) => void) {
  const baseUrl = buildHttpUrl(config);
  const performRequest = useCallback(async <T,>(method: 'GET' | 'POST' | 'DELETE', path: string, body?: unknown): Promise<Result<T>> => {
    const url = `${baseUrl}${path}`;
    addLog(LogLevel.Http, `${method} ${url}`, body);
    try {
      // Get Firebase token for authentication
      const auth = getFirebaseAuth();
      const currentUser = auth?.currentUser;
      const token = currentUser ? await currentUser.getIdToken() : null;

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
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

  return useMemo(() => ({
    createSession: (clientId: string, initialState?: Record<string, unknown>) => performRequest<Session>('POST', `/clients/${clientId}/sessions`, { state: initialState }),
    createSessionWithId: (sessionId: string, initialState?: Record<string, unknown>) => performRequest<Session>('POST', `/apps/${config.appName}/users/${config.userId}/sessions/${sessionId}`, initialState),
    listSessions: () => performRequest<Session[]>('GET', `/apps/${config.appName}/users/${config.userId}/sessions`),
    getSession: (sessionId: string) => performRequest<SessionDetails>('GET', `/apps/${config.appName}/users/${config.userId}/sessions/${sessionId}`),
    deleteSession: (clientId: string, sessionId: string) => performRequest('DELETE', `/clients/${clientId}/sessions/${sessionId}`),
    ingestSessionMemoryFor: (sessionId: string) =>
      performRequest<{ success: boolean; status: string; session_id: string; message: string }>('POST', `/clients/${config.userId}/sessions/${sessionId}/memory`),
    generateReport: (sessionId: string, payload?: Record<string, unknown>) =>
      performRequest<{ success: boolean; session_id: string; message: string }>('POST', `/clients/${config.userId}/sessions/${sessionId}/reports`, payload),
    createNote: (clientId: string, payload: { audio_data: string; date_de_visite: string }) =>
      performRequest<{ success: boolean; note_id: string; message: string }>('POST', `/clients/${clientId}/notes`, payload),
  }), [performRequest, config.appName, config.userId]);
}