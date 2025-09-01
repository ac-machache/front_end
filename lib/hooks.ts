"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Config, LogEntry, LogLevel, WsStatus } from './types';
import { LogLevel as LogLevelEnum, WsStatus as WsStatusEnum } from './types';
import { buildHttpUrl, arrayBufferToBase64, base64ToUint8Array } from './utils';
// Use the same JS modules as the original app, served from /public/js
// These are standard ES modules under /public, import via absolute path at runtime
// We will dynamic import them inside startMic to avoid SSR issues

// Local storage
export function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const setValue = React.useCallback((value: T | ((val: T) => T)) => {
    setStoredValue(prev => {
      const nextValue = value instanceof Function ? (value as (val: T) => T)(prev) : value;
      try { window.localStorage.setItem(key, JSON.stringify(nextValue)); } catch {}
      return nextValue;
    });
  }, [key]);
  return [storedValue, setValue];
}

// API client
export function useApiClient(config: Config, addLog: (level: LogLevel, message: string, data?: any) => void) {
  const baseUrl = buildHttpUrl(config);
  const performRequest = useCallback(async <T,>(method: 'GET' | 'POST', path: string, body?: any): Promise<T | null> => {
    const url = `${baseUrl}${path}`;
    addLog(LogLevelEnum.Http, `${method} ${url}`, body);
    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      if (!response.ok) { const err: any = new Error(`HTTP ${response.status}`); err.cause = data; throw err; }
      addLog(LogLevelEnum.Http, `Success: ${response.status}`, data);
      return data;
    } catch (error: any) {
      addLog(LogLevelEnum.Error, error.message, error.cause || error);
      return null;
    }
  }, [baseUrl, addLog]);

  return {
    createSession: (initialState?: any) => performRequest('POST', `/apps/${config.appName}/users/${config.userId}/sessions`, initialState),
    createSessionWithId: (sessionId: string, initialState?: any) => performRequest('POST', `/apps/${config.appName}/users/${config.userId}/sessions/${sessionId}`, initialState),
    listSessions: () => performRequest('GET', `/apps/${config.appName}/users/${config.userId}/sessions`),
    getSession: (sessionId: string) => performRequest('GET', `/apps/${config.appName}/users/${config.userId}/sessions/${sessionId}`),
  };
}

// WebSocket
export function useWebSocket(url: string, onOpen: () => void, onMessage: (data: any) => void, onClose: (code: number, reason: string) => void, onError: (event: Event) => void) {
  const ws = useRef<WebSocket | null>(null);
  const isManuallyClosingRef = useRef(false);
  const [status, setStatus] = useState<WsStatus>(WsStatusEnum.Disconnected);
  const connect = useCallback(() => {
    if (ws.current) {
      const state = ws.current.readyState;
      if (state === WebSocket.OPEN || state === WebSocket.CONNECTING || state === WebSocket.CLOSING) {
        return;
      }
    }
    setStatus(WsStatusEnum.Connecting);
    isManuallyClosingRef.current = false;
    const socket = new WebSocket(url);
    socket.binaryType = 'arraybuffer';
    socket.onopen = () => { ws.current = socket; setStatus(WsStatusEnum.Connected); onOpen(); };
    socket.onmessage = async (event) => {
      try {
        if (typeof event.data === 'string') {
          onMessage(JSON.parse(event.data));
        } else if (event.data instanceof ArrayBuffer) {
          onMessage({ mime_type: 'audio/pcm', data: arrayBufferToBase64(event.data) });
        } else if (event.data instanceof Blob) {
          const buf = await event.data.arrayBuffer();
          onMessage({ mime_type: 'audio/pcm', data: arrayBufferToBase64(buf) });
        }
      } catch {}
    };
    socket.onclose = (event) => {
      setStatus(WsStatusEnum.Disconnected);
      onClose(event.code, event.reason);
      if (ws.current === socket) {
        ws.current = null;
      }
      isManuallyClosingRef.current = false;
    };
    socket.onerror = (event) => { setStatus(WsStatusEnum.Error); onError(event as unknown as Event); };
    ws.current = socket;
  }, [url, onOpen, onMessage, onClose, onError]);
  const disconnect = useCallback(() => {
    if (!ws.current) { setStatus(WsStatusEnum.Disconnected); return; }
    const state = ws.current.readyState;
    if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) {
      isManuallyClosingRef.current = true;
      // Detach handlers to avoid duplicate logs during close
      try {
        ws.current.onopen = null as any;
        ws.current.onmessage = null as any;
        ws.current.onerror = null as any;
      } catch {}
      ws.current.close(1000, 'User disconnected');
    }
  }, []);
  const sendMessage = useCallback((data: any) => { if (ws.current && ws.current.readyState === WebSocket.OPEN) ws.current.send(JSON.stringify(data)); }, []);
  return { connect, disconnect, sendMessage, status };
}

// Audio processing
export function useAudioProcessor(
  onMicData: (base64Data: string, mime?: string) => void,
  addLog: (level: LogLevel, message: string, data?: any) => void,
  onLevel?: (level01: number) => void
) {
  const playerContext = useRef<AudioContext | null>(null);
  const recorderContext = useRef<AudioContext | null>(null);
  const audioPlayerNode = useRef<AudioWorkletNode | null>(null);
  const recorderNode = useRef<AudioWorkletNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micChunkQueue = useRef<Uint8Array[]>([]);
  const micFlushTimer = useRef<number | null>(null);
  const MIC_FLUSH_MS = 200;

  function convertFloat32ToPCM16(float32: Float32Array): ArrayBuffer {
    const pcm16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
      const s = Math.max(-1, Math.min(1, float32[i]));
      pcm16[i] = s * 0x7fff;
    }
    return pcm16.buffer;
  }

  const startMic = useCallback(async () => {
    try {
      // Ensure player is initialized
      if (!playerContext.current) {
        const playerModulePath = '/js/audio-player.js';
        const playerModule = await import(/* webpackIgnore: true */ (playerModulePath as string));
        const { startAudioPlayerWorklet } = playerModule as any;
        const [player, audioContext] = await startAudioPlayerWorklet();
        await audioContext.resume().catch(() => {});
        audioPlayerNode.current = player; playerContext.current = audioContext;
      }

      // Initialize recorder only once
      if (!recorderContext.current) {
        const recorderModulePath = '/js/audio-recorder.js';
        const recorderModule = await import(/* webpackIgnore: true */ (recorderModulePath as string));
        const { startAudioRecorderWorklet } = recorderModule as any;
        const [recNode, recCtx, stream] = await startAudioRecorderWorklet((pcm16Buf: ArrayBuffer) => {
          const uint8 = new Uint8Array(pcm16Buf);
          micChunkQueue.current.push(uint8);
          // Compute simple RMS level for visualization
          if (onLevel) {
            const view = new Int16Array(pcm16Buf);
            let sumSquares = 0;
            for (let i = 0; i < view.length; i += 1) {
              const v = view[i] / 32768; // normalize -1..1
              sumSquares += v * v;
            }
            const rms = view.length ? Math.sqrt(sumSquares / view.length) : 0;
            const clamped = Math.max(0, Math.min(1, rms));
            onLevel(clamped);
          }
        });
        await recCtx.resume().catch(() => {});
        recorderNode.current = recNode; recorderContext.current = recCtx; micStreamRef.current = stream;
      }

      if (micFlushTimer.current == null) {
        micFlushTimer.current = window.setInterval(() => {
          if (micChunkQueue.current.length === 0) return;
          let total = 0; for (const c of micChunkQueue.current) total += c.length;
          const combined = new Uint8Array(total); let off = 0; for (const c of micChunkQueue.current) { combined.set(c, off); off += c.length; }
          micChunkQueue.current = [];
          onMicData(arrayBufferToBase64(combined.buffer), 'audio/pcm');
        }, MIC_FLUSH_MS);
      }
    } catch (err: any) {
      const message = err?.message || String(err);
      addLog(LogLevelEnum.Error, `Error starting microphone: ${message}`, err);
    }
  }, [addLog, onMicData]);

  const stopMic = useCallback(() => {
    if (recorderNode.current) { recorderNode.current.disconnect(); recorderNode.current = null; }
    if (micStreamRef.current) { micStreamRef.current.getTracks().forEach(t => t.stop()); micStreamRef.current = null; }
    if (audioPlayerNode.current) { audioPlayerNode.current.disconnect(); audioPlayerNode.current = null; }
    if (micFlushTimer.current != null) { window.clearInterval(micFlushTimer.current); micFlushTimer.current = null; }
    micChunkQueue.current = [];

    // Do not aggressively close the contexts. Instead, nullify them and let
    // the browser's garbage collector handle cleanup gracefully. This prevents crashes.
    recorderContext.current = null;
    playerContext.current = null;
  }, []);

  const playAudioChunk = useCallback((base64Data: string) => {
    if (!audioPlayerNode.current) { addLog(LogLevelEnum.Error, 'Audio player not initialized'); return; }
    const pcmBytes = base64ToUint8Array(base64Data);
    audioPlayerNode.current.port.postMessage(pcmBytes.buffer);
  }, [addLog]);

  const clearPlaybackQueue = useCallback(() => { if (audioPlayerNode.current) audioPlayerNode.current.port.postMessage({ command: 'endOfAudio' }); }, []);

  useEffect(() => () => { stopMic(); }, [stopMic]);

  return { startMic, stopMic, playAudioChunk, clearPlaybackQueue };
}

