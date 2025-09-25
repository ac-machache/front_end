"use client";
import React from 'react';
import { LogLevel } from '../types';
import { AUDIO_CONSTANTS } from './useAudio';

export function useVisibilityGuard(
  addLog: (level: LogLevel, message: string, data?: unknown) => void,
  options: {
    pause: () => Promise<void> | void;
    restore: () => Promise<void> | void;
    disconnect: () => Promise<void> | void;
    graceMs?: number;
  }
) {
  const hiddenTimerRef = React.useRef<number | null>(null);
  const isHiddenRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    const GRACE_MS = options.graceMs ?? AUDIO_CONSTANTS.VISIBILITY_GRACE_MS;

    const pause = async () => { try { await options.pause(); } catch {} };
    const restore = async () => { try { await options.restore(); } catch {} };
    const disconnect = async () => { try { await options.disconnect(); } catch {} };

    const onHidden = () => {
      isHiddenRef.current = true;
      void pause();
      if (hiddenTimerRef.current) { try { window.clearTimeout(hiddenTimerRef.current); } catch {} }
      hiddenTimerRef.current = window.setTimeout(() => {
        if (isHiddenRef.current) void disconnect();
      }, GRACE_MS);
    };
    const onVisible = () => {
      isHiddenRef.current = false;
      if (hiddenTimerRef.current) { try { window.clearTimeout(hiddenTimerRef.current); } catch {} hiddenTimerRef.current = null; }
      void restore();
    };

    const visHandler = () => (document.visibilityState === 'hidden' ? onHidden() : onVisible());

    try { document.addEventListener('visibilitychange', visHandler); } catch {}
    try { window.addEventListener('pagehide', onHidden); } catch {}
    try { (window as unknown as { addEventListener?: (t: string, cb: () => void) => void }).addEventListener?.('freeze', onHidden); } catch {}

    return () => {
      try { document.removeEventListener('visibilitychange', visHandler); } catch {}
      try { window.removeEventListener('pagehide', onHidden); } catch {}
      try { (window as unknown as { removeEventListener?: (t: string, cb: () => void) => void }).removeEventListener?.('freeze', onHidden); } catch {}
      if (hiddenTimerRef.current) { try { window.clearTimeout(hiddenTimerRef.current); } catch {} hiddenTimerRef.current = null; }
    };
  }, [addLog, options]);
}