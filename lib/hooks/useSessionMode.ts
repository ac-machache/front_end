"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { LogLevel } from '../types';

// Simplified mode management
export type IAdvisorMode = 'idle' | 'thinking' | 'responding' | 'connecting' | 'disconnected';

export function useSessionMode(
  addLog: (level: LogLevel, message: string, data?: unknown) => void
) {
  const [mode, setMode] = useState<IAdvisorMode>('idle');
  const speakTimerRef = useRef<number | null>(null);

  const setModeWithLog = useCallback((newMode: IAdvisorMode, reason?: string) => {
    const oldMode = mode;
    setMode(newMode);
    addLog(LogLevel.Event, `Mode changed: ${oldMode} -> ${newMode}`, { reason });
  }, [mode, addLog]);

  const startResponding = useCallback((duration: number = 2500) => {
    // Clear any existing timer
    if (speakTimerRef.current) {
      window.clearTimeout(speakTimerRef.current);
      speakTimerRef.current = null;
    }

    setModeWithLog('responding', `Starting response for ${duration}ms`);

    speakTimerRef.current = window.setTimeout(() => {
      setModeWithLog('idle', 'Response timeout');
      speakTimerRef.current = null;
    }, duration);
  }, [setModeWithLog]);

  const startThinking = useCallback(() => {
    setModeWithLog('thinking', 'Starting tool call');
  }, [setModeWithLog]);

  const stopThinking = useCallback(() => {
    setModeWithLog('idle', 'Tool call completed');
  }, [setModeWithLog]);

  const resetToIdle = useCallback(() => {
    if (speakTimerRef.current) {
      window.clearTimeout(speakTimerRef.current);
      speakTimerRef.current = null;
    }
    setModeWithLog('idle', 'Manual reset');
  }, [setModeWithLog]);

  const setConnecting = useCallback(() => {
    setModeWithLog('connecting', 'Connection in progress');
  }, [setModeWithLog]);

  const setDisconnected = useCallback(() => {
    setModeWithLog('disconnected', 'Connection lost');
  }, [setModeWithLog]);

  const cleanup = useCallback(() => {
    if (speakTimerRef.current) {
      window.clearTimeout(speakTimerRef.current);
      speakTimerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    mode,
    startResponding,
    startThinking,
    stopThinking,
    resetToIdle,
    setConnecting,
    setDisconnected,
    cleanup
  };
}