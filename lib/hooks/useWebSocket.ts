"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import type { WsStatus } from '../types';
import { WsStatus as WsStatusEnum } from '../types';
import { arrayBufferToBase64 } from '../utils';

export function useWebSocket(
  url: string,
  onOpen: () => void,
  onMessage: (data: unknown) => void,
  onClose: (code: number, reason: string, wasManual: boolean) => void,
  onError: (event: Event) => void,
) {
  const ws = useRef<WebSocket | null>(null);
  // Keep latest handler references to avoid stale closures
  const onOpenRef = useRef(onOpen);
  const onMessageRef = useRef(onMessage);
  const onCloseRef = useRef(onClose);
  const onErrorRef = useRef(onError);
  useEffect(() => { onOpenRef.current = onOpen; }, [onOpen]);
  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);
  const isManuallyClosingRef = useRef(false);
  const hasConnectedSuccessfullyRef = useRef(false); // New ref to track connection success
  const [status, setStatus] = useState<WsStatus>(WsStatusEnum.Disconnected);

  const connect = useCallback(() => {
    if (ws.current) {
      const state = ws.current.readyState;
      if (state === WebSocket.OPEN) {
        return; // already connected
      }
      // If CONNECTING or CLOSING, aggressively replace the socket to avoid UI deadlocks
      try {
        ws.current.onopen = null as unknown as () => void;
        ws.current.onmessage = null as unknown as (e: MessageEvent) => void;
        ws.current.onerror = null as unknown as (e: Event) => void;
        ws.current.onclose = null as unknown as (e: CloseEvent) => void;
        ws.current.close();
      } catch {}
      ws.current = null;
    }
    setStatus(WsStatusEnum.Connecting);
    isManuallyClosingRef.current = false;

    // Do not auto-add resume=true; rely on explicit server events/UI
    const wsUrl = url;
    const socket = new WebSocket(wsUrl);
    socket.binaryType = 'arraybuffer';

    socket.onopen = () => {
      ws.current = socket;
      setStatus(WsStatusEnum.Connected);
      hasConnectedSuccessfullyRef.current = true; // Mark that we've had a successful connection
      try { onOpenRef.current(); } catch {}
    };

    socket.onmessage = async (event) => {
      try {
        if (typeof event.data === 'string') {
          onMessageRef.current(JSON.parse(event.data));
        } else if (event.data instanceof ArrayBuffer) {
          onMessageRef.current({ mime_type: 'audio/pcm', data: arrayBufferToBase64(event.data) });
        } else if (event.data instanceof Blob) {
          const buf = await event.data.arrayBuffer();
          onMessageRef.current({ mime_type: 'audio/pcm', data: arrayBufferToBase64(buf) });
        }
      } catch {}
    };

    socket.onclose = (event) => {
      setStatus(WsStatusEnum.Disconnected);
      const wasManual = isManuallyClosingRef.current;
      try { onCloseRef.current(event.code, event.reason, wasManual); } catch {}
      if (ws.current === socket) {
        ws.current = null;
      }
      isManuallyClosingRef.current = false;
    };

    socket.onerror = (event) => { setStatus(WsStatusEnum.Error); try { onErrorRef.current(event); } catch {} };
    ws.current = socket;
  }, [url]);

  // No auto-resume: just call connect as-is
  const connectWithResume = useCallback(() => { connect(); }, [connect]);

  const disconnect = useCallback(() => {
    if (!ws.current) { setStatus(WsStatusEnum.Disconnected); return; }
    const state = ws.current.readyState;
    if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) {
      isManuallyClosingRef.current = true;
      // Detach handlers to avoid duplicate logs during close
      try {
        ws.current.onopen = null;
        ws.current.onmessage = null;
        ws.current.onerror = null;
      } catch {}
      try { ws.current.close(1000, 'User disconnected'); } catch {}
      // Allow immediate reconnect without waiting for onclose
      ws.current = null;
    }
  }, []);

  const sendMessage = useCallback((data: unknown) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN)
      ws.current.send(JSON.stringify(data));
  }, []);

  return {
    connect: connectWithResume,
    disconnect,
    sendMessage,
    status,
    isFirstConnection: !hasConnectedSuccessfullyRef.current
  };
}