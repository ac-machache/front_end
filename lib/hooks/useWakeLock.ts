"use client";
import React from 'react';
import { LogLevel } from '../types';

export function useWakeLock(
  addLog: (level: LogLevel, message: string, data?: unknown) => void,
  shouldLock: boolean
) {
  const wakeLockRef = React.useRef<unknown | null>(null);

  React.useEffect(() => {
    const hasWakeLock = typeof (navigator as unknown as { wakeLock?: unknown }).wakeLock !== 'undefined';
    if (!hasWakeLock) { addLog(LogLevel.Ws, 'Wake Lock API not supported'); return; }
    let cancelled = false;

    const apply = async () => {
      try {
        if (shouldLock && !wakeLockRef.current) {
          const sentinel = await (navigator as unknown as { wakeLock: { request: (t: 'screen') => Promise<unknown> } }).wakeLock.request('screen');
          if (cancelled) { try { (sentinel as { release?: () => Promise<void> }).release?.(); } catch {} return; }
          wakeLockRef.current = sentinel;
          addLog(LogLevel.Ws, 'Wake Lock acquired');
          try {
            (sentinel as { addEventListener?: (t: string, cb: () => void) => void }).addEventListener?.('release', () => {
              addLog(LogLevel.Ws, 'Wake Lock released');
              wakeLockRef.current = null;
            });
          } catch {}
        }
        if (!shouldLock && wakeLockRef.current) {
          try { await (wakeLockRef.current as { release?: () => Promise<void> }).release?.(); } catch {}
          wakeLockRef.current = null;
          addLog(LogLevel.Ws, 'Wake Lock released (conditions changed)');
        }
      } catch (e) {
        addLog(LogLevel.Error, 'Wake Lock error', e);
        wakeLockRef.current = null;
      }
    };

    void apply();
    const onVisible = () => { if (document.visibilityState === 'visible') void apply(); };
    try { document.addEventListener('visibilitychange', onVisible); } catch {}
    return () => {
      cancelled = true;
      try { document.removeEventListener('visibilitychange', onVisible); } catch {}
      if (wakeLockRef.current) { try { (wakeLockRef.current as { release?: () => Promise<void> }).release?.(); } catch {} wakeLockRef.current = null; }
    };
  }, [addLog, shouldLock]);
}