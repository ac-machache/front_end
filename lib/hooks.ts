"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Config, LogLevel, WsStatus } from './types';
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
export function useApiClient(config: Config, addLog: (level: LogLevel, message: string, data?: unknown) => void) {
  const baseUrl = buildHttpUrl(config);
  const performRequest = useCallback(async <T,>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T | null> => {
    const url = `${baseUrl}${path}`;
    addLog(LogLevelEnum.Http, `${method} ${url}`, body);
    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      if (!response.ok) {
        const err = new Error(`HTTP ${response.status}`) as Error & { cause?: unknown };
        err.cause = data;
        throw err;
      }
      addLog(LogLevelEnum.Http, `Success: ${response.status}`, data);
      return data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const cause = (error as { cause?: unknown })?.cause ?? error;
      addLog(LogLevelEnum.Error, message, cause);
      return null;
    }
  }, [baseUrl, addLog]);

  return {
    createSession: (initialState?: Record<string, unknown>) => performRequest('POST', `/apps/${config.appName}/users/${config.userId}/sessions`, initialState),
    createSessionWithId: (sessionId: string, initialState?: Record<string, unknown>) => performRequest('POST', `/apps/${config.appName}/users/${config.userId}/sessions/${sessionId}`, initialState),
    listSessions: () => performRequest('GET', `/apps/${config.appName}/users/${config.userId}/sessions`),
    getSession: (sessionId: string) => performRequest('GET', `/apps/${config.appName}/users/${config.userId}/sessions/${sessionId}`),
    ingestSessionMemory: async (returnContext: boolean = false) => {
      const path = `/apps/${config.appName}/users/${config.userId}/sessions/${config.sessionId}/ingest?return_context=${returnContext ? 'true' : 'false'}`;
      const url = `${baseUrl}${path}`;
      addLog(LogLevelEnum.Http, `POST ${url} (keepalive/beacon)`, undefined);
      try {
        // Prefer sendBeacon when available for background delivery on navigation
        if (typeof navigator !== 'undefined' && (navigator as unknown as { sendBeacon?: (url: string, data?: BodyInit | null) => boolean }).sendBeacon) {
          const ok = (navigator as unknown as { sendBeacon: (url: string, data?: BodyInit | null) => boolean }).sendBeacon(url);
          if (ok) { addLog(LogLevelEnum.Http, 'sendBeacon queued', { url }); return { status: 'queued' } as unknown; }
        }
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true });
        const text = await response.text();
        const data: unknown = text ? JSON.parse(text) : null;
        if (!response.ok) {
          const err = new Error(`HTTP ${response.status}`) as Error & { cause?: unknown };
          err.cause = data;
          throw err;
        }
        addLog(LogLevelEnum.Http, `Success: ${response.status}`, data);
        return data;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        const cause = (error as { cause?: unknown })?.cause ?? error;
        addLog(LogLevelEnum.Error, message, cause);
        return null;
      }
    },
  };
}

// Enhanced WebSocket with disconnect reason tracking
export function useWebSocket(
  url: string,
  onOpen: () => void,
  onMessage: (data: unknown) => void,
  onClose: (code: number, reason: string, wasManual: boolean) => void,
  onError: (event: Event) => void,
) {
  const ws = useRef<WebSocket | null>(null);
  const isManuallyClosingRef = useRef(false);
  const connectionAttemptRef = useRef(0);
  const [status, setStatus] = useState<WsStatus>(WsStatusEnum.Disconnected);
  
  const connect = useCallback((resumeConnection = false) => {
    if (ws.current) {
      const state = ws.current.readyState;
      if (state === WebSocket.OPEN || state === WebSocket.CONNECTING || state === WebSocket.CLOSING) {
        return;
      }
    }
    setStatus(WsStatusEnum.Connecting);
    isManuallyClosingRef.current = false;
    connectionAttemptRef.current += 1;
    
    // Build URL with resume parameter if this is a reconnection attempt
    const wsUrl = resumeConnection ? `${url}&resume=true` : url;
    const socket = new WebSocket(wsUrl);
    socket.binaryType = 'arraybuffer';
    
    socket.onopen = () => { 
      ws.current = socket; 
      setStatus(WsStatusEnum.Connected); 
      // Preserve connectionAttemptRef so auto-reconnects can append resume=true
      onOpen(); 
    };
    
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
      const wasManual = isManuallyClosingRef.current;
      onClose(event.code, event.reason, wasManual);
      if (ws.current === socket) {
        ws.current = null;
      }
      isManuallyClosingRef.current = false;
    };
    
    socket.onerror = (event) => { setStatus(WsStatusEnum.Error); onError(event); };
    ws.current = socket;
  }, [url, onOpen, onMessage, onClose, onError]);
  
  // Enhanced connect for resumption
  const connectWithResume = useCallback(() => {
    const shouldResume = connectionAttemptRef.current > 0; // Resume if this isn't the first connection
    connect(shouldResume);
  }, [connect]);
  
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
      ws.current.close(1000, 'User disconnected');
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
    isFirstConnection: connectionAttemptRef.current === 0
  };
}

// Audio processing
export function useAudioProcessor(
  onMicData: (base64Data: string, mime?: string) => void,
  addLog: (level: LogLevel, message: string, data?: unknown) => void,
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
  // Gate to allow pausing the upstream without releasing the mic device
  // Default OFF so UI mic button explicitly enables sending
  const streamingEnabledRef = useRef<boolean>(false);
  const setStreamingEnabled = useCallback((enabled: boolean) => { 
    streamingEnabledRef.current = enabled;
    addLog(LogLevelEnum.Audio, `Streaming ${enabled ? 'enabled' : 'disabled'}`, { enabled });
  }, [addLog]);

  const startMic = useCallback(async () => {
    try {
      // Ensure player is initialized
      if (!playerContext.current) {
        const playerModulePath = '/js/audio-player.js';
        type PlayerModule = { startAudioPlayerWorklet: () => Promise<[AudioWorkletNode, AudioContext]> };
        const playerModule = await import(/* webpackIgnore: true */ (playerModulePath as string)) as PlayerModule;
        const { startAudioPlayerWorklet } = playerModule;
        const [player, audioContext] = await startAudioPlayerWorklet();
        await audioContext.resume().catch(() => {});
        audioPlayerNode.current = player; playerContext.current = audioContext;
      }

      // Initialize recorder only once
      if (!recorderContext.current) {
        const recorderModulePath = '/js/audio-recorder.js';
        type RecorderModule = { startAudioRecorderWorklet: (cb: (pcm16Buf: ArrayBuffer) => void) => Promise<[AudioWorkletNode, AudioContext, MediaStream]> };
        const recorderModule = await import(/* webpackIgnore: true */ (recorderModulePath as string)) as RecorderModule;
        const { startAudioRecorderWorklet } = recorderModule;
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
        addLog(LogLevelEnum.Audio, 'Starting microphone flush timer');
        micFlushTimer.current = window.setInterval(() => {
          const queueLength = micChunkQueue.current.length;
          addLog(LogLevelEnum.Audio, 'Timer tick', { 
            queueLength, 
            streamingEnabled: streamingEnabledRef.current,
            timerRunning: true
          });
          
          if (queueLength === 0) {
            return;
          }
          
          let total = 0; for (const c of micChunkQueue.current) total += c.length;
          const combined = new Uint8Array(total); let off = 0; for (const c of micChunkQueue.current) { combined.set(c, off); off += c.length; }
          addLog(LogLevelEnum.Audio, 'Processing audio chunks', { 
            chunkCount: queueLength, 
            totalBytes: total,
            streamingEnabled: streamingEnabledRef.current 
          });
          micChunkQueue.current = [];
          
          if (streamingEnabledRef.current) {
            onMicData(arrayBufferToBase64(combined.buffer), 'audio/pcm');
          } else {
            addLog(LogLevelEnum.Audio, 'Audio data captured but streaming disabled');
          }
        }, MIC_FLUSH_MS);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      addLog(LogLevelEnum.Error, `Error starting microphone: ${message}`, err);
    }
  }, [addLog, onMicData, onLevel]);

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

  return { startMic, stopMic, playAudioChunk, clearPlaybackQueue, setStreamingEnabled };
}

// Audio playback management with priority system
export function useAudioPlayback(
  addLog: (level: LogLevel, message: string, data?: unknown) => void
) {
  const toolSoundRef = useRef<HTMLAudioElement | null>(null);
  const connectedSoundRef = useRef<HTMLAudioElement | null>(null);
  const toolLoopingRef = useRef<boolean>(false);
  const toolCallActiveRef = useRef<boolean>(false);
  const thinkingTimeoutRef = useRef<number | null>(null);

  // Audio priority levels (higher number = higher priority)
  enum AudioPriority {
    NONE = 0,
    TOOL_SOUND = 1,
    MODEL_AUDIO = 2
  }

  const currentPriorityRef = useRef<AudioPriority>(AudioPriority.NONE);

  const initSounds = useCallback(() => {
    try {
      if (!toolSoundRef.current) {
        const toolSound = new Audio('/Thinking.mp3');
        toolSound.preload = 'auto';
        toolSound.loop = false; // We'll control looping manually
        toolSoundRef.current = toolSound;
      }
      if (!connectedSoundRef.current) {
        const connectedSound = new Audio('/Connected.mp3');
        connectedSound.preload = 'auto';
        connectedSoundRef.current = connectedSound;
      }
    } catch (err) {
      addLog(LogLevelEnum.Error, 'Failed to initialize audio files', err);
    }
  }, [addLog]);

  const playConnectedSound = useCallback(() => {
    try {
      const sound = connectedSoundRef.current;
      if (sound) {
        sound.currentTime = 0;
        void sound.play().catch(() => {});
      }
    } catch (err) {
      addLog(LogLevelEnum.Audio, 'Failed to play connected sound', err);
    }
  }, [addLog]);

  const startToolSound = useCallback(() => {
    try {
      const sound = toolSoundRef.current;
      if (!sound || currentPriorityRef.current >= AudioPriority.MODEL_AUDIO) {
        return; // Don't start tool sound if model audio is playing
      }

      sound.loop = true;
      sound.currentTime = 0;
      toolLoopingRef.current = true;
      currentPriorityRef.current = AudioPriority.TOOL_SOUND;
      void sound.play().catch(() => {
        addLog(LogLevelEnum.Audio, 'Tool loop play blocked (autoplay)');
      });
    } catch (err) {
      addLog(LogLevelEnum.Audio, 'Failed to start tool sound', err);
    }
  }, [addLog]);

  const stopToolSound = useCallback(() => {
    try {
      const sound = toolSoundRef.current;
      if (!sound) return;

      sound.loop = false;
      sound.pause();
      sound.currentTime = 0;
      toolLoopingRef.current = false;

      // Only reset priority if tool sound was the highest priority
      if (currentPriorityRef.current === AudioPriority.TOOL_SOUND) {
        currentPriorityRef.current = AudioPriority.NONE;
      }
    } catch (err) {
      addLog(LogLevelEnum.Audio, 'Failed to stop tool sound', err);
    }
  }, []);

  const playModelAudio = useCallback(() => {
    // Model audio always takes priority and stops tool sounds
    currentPriorityRef.current = AudioPriority.MODEL_AUDIO;
    stopToolSound();
  }, [stopToolSound]);

  const endModelAudio = useCallback(() => {
    // Model audio ended, reset to NONE (tool sounds can resume if active)
    if (currentPriorityRef.current === AudioPriority.MODEL_AUDIO) {
      currentPriorityRef.current = AudioPriority.NONE;
      // If tool call was still active when model audio started, resume tool sound
      if (toolCallActiveRef.current && !toolLoopingRef.current) {
        startToolSound();
      }
    }
  }, [startToolSound]);

  const startToolCall = useCallback(() => {
    toolCallActiveRef.current = true;
    startToolSound();

    // Set timeout for tool call completion
    if (thinkingTimeoutRef.current) {
      window.clearTimeout(thinkingTimeoutRef.current);
    }
    thinkingTimeoutRef.current = window.setTimeout(() => {
      addLog(LogLevelEnum.Event, 'Tool call timeout - ending tool call');
      endToolCall();
    }, 120000);
  }, [addLog, startToolSound]);

  const endToolCall = useCallback(() => {
    toolCallActiveRef.current = false;
    stopToolSound();

    if (thinkingTimeoutRef.current) {
      window.clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }
  }, [stopToolSound]);

  const cleanup = useCallback(() => {
    stopToolSound();
    toolCallActiveRef.current = false;

    if (thinkingTimeoutRef.current) {
      window.clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }
  }, [stopToolSound]);

  // Initialize sounds on mount
  useEffect(() => {
    initSounds();
  }, [initSounds]);

  return {
    initSounds,
    playConnectedSound,
    startToolSound,
    stopToolSound,
    playModelAudio,
    endModelAudio,
    startToolCall,
    endToolCall,
    cleanup,
    isToolSoundPlaying: () => toolLoopingRef.current,
    isToolCallActive: () => toolCallActiveRef.current
  };
}

// Session reconnection management
export function useSessionReconnection(
  addLog: (level: LogLevel, message: string, data?: unknown) => void,
  startMic: () => Promise<void>,
  stopMic: () => void,
  connect: () => void,
  disconnect: () => void,
  setStreamingEnabled: (enabled: boolean) => void,
  clearPlaybackQueue: () => void
) {
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false);
  const [connectionState, setConnectionState] = useState<{
    isResuming: boolean;
    hasResumed: boolean;
    backendSessionState?: {
      mode: string;
      turnId: string | number;
      hasPendingFunctions: boolean;
    };
  }>({
    isResuming: false,
    hasResumed: false,
  });

  const manualDisconnectRef = useRef<boolean>(false);
  const shouldAutoReconnectRef = useRef<boolean>(true);
  const reconnectAttemptsRef = useRef<number>(0);
  const reconnectTimerRef = useRef<number | null>(null);

  const startReconnection = useCallback((isManualDisconnect: boolean = false) => {
    if (!isManualDisconnect) {
      setIsReconnecting(true);
      setConnectionState(prev => ({ ...prev, isResuming: true, hasResumed: false }));
    }
    manualDisconnectRef.current = isManualDisconnect;
  }, []);

  const endReconnection = useCallback(() => {
    setIsReconnecting(false);
    setConnectionState(prev => ({ ...prev, isResuming: false }));

    // Clear resumed state after 5 seconds
    setTimeout(() => {
      setConnectionState(prev => ({ ...prev, hasResumed: false }));
    }, 5000);
  }, []);

  const handleSessionResumed = useCallback((state: {
    mode: string;
    turn_id: string | number;
    has_pending_functions: boolean;
  }) => {
    setConnectionState(prev => ({
      ...prev,
      hasResumed: true,
      isResuming: false,
      backendSessionState: {
        mode: state.mode,
        turnId: state.turn_id,
        hasPendingFunctions: state.has_pending_functions
      }
    }));
    setIsReconnecting(false);
  }, []);

  const attemptReconnection = useCallback(async () => {
    const attempt = reconnectAttemptsRef.current;
    const delay = Math.min(5000, 1000 * Math.pow(2, attempt)); // Exponential backoff

    // Prevent infinite reconnection attempts
    if (attempt >= 5) {
      addLog(LogLevelEnum.Error, 'Max reconnection attempts reached - giving up');
      setIsReconnecting(false);
      return;
    }

    addLog(LogLevelEnum.Ws, `Scheduling auto-reconnect attempt ${attempt + 1} in ${delay}ms`);

    reconnectTimerRef.current = window.setTimeout(async () => {
      try {
        addLog(LogLevelEnum.Ws, `Auto-reconnect attempt ${attempt + 1} starting`);
        setIsReconnecting(true);

        await startMic();
        connect();
        reconnectAttemptsRef.current = 0; // Reset on success
      } catch (err) {
        reconnectAttemptsRef.current = attempt + 1;
        addLog(LogLevelEnum.Error, `Auto-reconnect attempt ${attempt + 1} failed`, err);
        // Schedule next attempt only if we haven't hit max attempts
        if (reconnectAttemptsRef.current < 5) {
          attemptReconnection();
        } else {
          setIsReconnecting(false);
        }
      }
    }, delay);
  }, [addLog, startMic, connect]);

  const manualConnect = useCallback(async (restoreMicState: boolean = false) => {
    manualDisconnectRef.current = false;
    shouldAutoReconnectRef.current = true;

    // Clear any pending reconnect timers
    if (reconnectTimerRef.current) {
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    reconnectAttemptsRef.current = 0;

    try {
      await startMic();
      if (restoreMicState) {
        setStreamingEnabled(true);
      }
      connect();
    } catch (err) {
      addLog(LogLevelEnum.Error, 'Manual connect failed', err);
      throw err;
    }
  }, [addLog, startMic, setStreamingEnabled, connect]);

  const manualDisconnect = useCallback(() => {
    manualDisconnectRef.current = true;
    shouldAutoReconnectRef.current = false;

    // Clear any pending reconnect timers
    if (reconnectTimerRef.current) {
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    reconnectAttemptsRef.current = 0;

    // Clean up audio state
    stopMic();
    setStreamingEnabled(false);
    clearPlaybackQueue();

    disconnect();
  }, [stopMic, setStreamingEnabled, clearPlaybackQueue, disconnect]);

  const handleConnectionClose = useCallback((code?: number, reason?: string, wasManual?: boolean) => {
    addLog(LogLevelEnum.Ws, 'Connection closed', { code, reason, wasManual });

    if (wasManual) {
      setConnectionState(prev => ({ ...prev, isResuming: false, hasResumed: false }));
      setIsReconnecting(false);
    } else {
      startReconnection(false);
      if (shouldAutoReconnectRef.current) {
        attemptReconnection();
      }
    }
  }, [addLog, startReconnection, attemptReconnection]);

  const handleConnectionOpen = useCallback(() => {
    endReconnection();
  }, [endReconnection]);

  const cleanup = useCallback(() => {
    if (reconnectTimerRef.current) {
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    isReconnecting,
    connectionState,
    reconnectAttempts: reconnectAttemptsRef.current,
    manualConnect,
    manualDisconnect,
    handleConnectionClose,
    handleConnectionOpen,
    handleSessionResumed,
    cleanup
  };
}

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
    addLog(LogLevelEnum.Event, `Mode changed: ${oldMode} -> ${newMode}`, { reason });
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

