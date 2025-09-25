"use client";
import { useCallback } from 'react';
import { LogLevel } from '../types';

export function useLogger() {
  const addLog = useCallback((level: LogLevel, message: string, data?: unknown) => {
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.debug(`[${level}] ${message}`, data ?? '');
      } catch {}
    }
  }, []);

  return { addLog };
}