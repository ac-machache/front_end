"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Config, WsStatus, SessionDetails } from './types';
import { LogLevel as LogLevelEnum, WsStatus as WsStatusEnum, LogLevel } from './types';
import { buildHttpUrl, arrayBufferToBase64, base64ToUint8Array } from './utils';
import { getClientSessionDoc } from './firebase';
// Use the same JS modules as the original app, served from /public/js
// These are standard ES modules under /public, import via absolute path at runtime
// We will dynamic import them inside startMic to avoid SSR issues

// Constants
export const AUDIO_CONSTANTS = {
  MIC_FLUSH_MS: 50,
  HEARTBEAT_TIMEOUT_MS: 20000,
  MODEL_AUDIO_KEEP_ALIVE_MS: 500,
  TOOL_CALL_TIMEOUT_MS: 120000,
  VISIBILITY_GRACE_MS: 12000,
} as const;

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

// Custom hook for session report fetching
export function useSessionReport(sessionId: string, clientId: string, user: { uid: string } | null) {
  const [reportDetails, setReportDetails] = useState<SessionDetails | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  const apiClient = useApiClient({
    scheme: (typeof window !== 'undefined' && window.location.protocol === 'https:') ? 'wss' : 'ws',
    host: 'env',
    port: '0',
    appName: 'app',
    userId: clientId || 'user',
    sessionId: ''
  }, () => {}); // Simplified logging

  React.useEffect(() => {
    if (!sessionId || !clientId) {
      setReportDetails(null);
      return;
    }

    setReportLoading(true);
    (async () => {
      try {
        // Prefer Firestore ReportKey if present (requires user.uid)
        if (user?.uid) {
          const fsDoc = await getClientSessionDoc(user.uid, clientId, sessionId);
          const reportKey = fsDoc?.ReportKey;
          if (reportKey) {
            setReportDetails({ id: sessionId, state: { RapportDeSortie: reportKey } });
            return;
          }
        }
        // Fallback to backend
        const details = await apiClient.getSession(sessionId) as SessionDetails | null;
        setReportDetails(details);
      } finally {
        setReportLoading(false);
      }
    })().catch(() => setReportLoading(false));
  }, [sessionId, clientId, user?.uid, apiClient]);

  return { reportDetails, reportLoading };
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
    deleteSession: (sessionId: string) => performRequest('POST', `/apps/${config.appName}/users/${config.userId}/sessions/${sessionId}/delete`),
    ingestSessionMemoryFor: (sessionId: string, returnContext: boolean = false) =>
      performRequest('POST', `/apps/${config.appName}/users/${config.userId}/sessions/${sessionId}/ingest?return_context=${returnContext ? 'true' : 'false'}`),
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

// Audio processing
export function useAudioProcessor(
  onMicData: (base64Data: string, mime?: string) => void,
  addLog: (level: LogLevel, message: string, data?: unknown) => void,
  onLevel?: (level01: number) => void,
  onPlaybackDrained?: () => void
) {
  const playerContext = useRef<AudioContext | null>(null);
  const recorderContext = useRef<AudioContext | null>(null);
  const audioPlayerNode = useRef<AudioWorkletNode | null>(null);
  const recorderNode = useRef<AudioWorkletNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micChunkQueue = useRef<Uint8Array[]>([]);
  const micFlushTimer = useRef<number | null>(null);
  // Gate to allow pausing the upstream without releasing the mic device
  // Default OFF so UI mic button explicitly enables sending
  const streamingEnabledRef = useRef<boolean>(false);
  const setStreamingEnabled = useCallback((enabled: boolean) => { 
    streamingEnabledRef.current = enabled;
  }, []);

  const startMic = useCallback(async () => {
    try {
      // Always drop any stale buffered mic data before (re)starting
      micChunkQueue.current = [];
      // Ensure we don't have a lingering flush timer from a previous run
      if (micFlushTimer.current != null) {
        try { window.clearInterval(micFlushTimer.current); } catch {}
        micFlushTimer.current = null;
      }
      // Ensure player is initialized
      if (!playerContext.current) {
        const playerModulePath = '/js/audio-player.js';
        type PlayerModule = { startAudioPlayerWorklet: () => Promise<[AudioWorkletNode, AudioContext]> };
        const playerModule = await import(/* webpackIgnore: true */ (playerModulePath as string)) as PlayerModule;
        const { startAudioPlayerWorklet } = playerModule;
        const [player, audioContext] = await startAudioPlayerWorklet();
        await audioContext.resume().catch(() => {});
        audioPlayerNode.current = player; playerContext.current = audioContext;
        // Listen for drain events from the player worklet to end model audio precisely
        try {
          audioPlayerNode.current.port.onmessage = (e: MessageEvent) => {
            const data = (e as unknown as { data?: unknown }).data as { event?: string } | undefined;
            if (data && data.event === 'buffer_empty') {
              try { if (onPlaybackDrained) onPlaybackDrained(); } catch {}
            }
          };
        } catch {}
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
          // Reduced verbosity: keep minimal tick info only when troubleshooting
          // addLog(LogLevelEnum.Audio, 'Timer tick', {
          //   queueLength,
          //   streamingEnabled: streamingEnabledRef.current,
          //   timerRunning: true
          // });
          
          if (queueLength === 0) {
            return;
          }
          
          let total = 0; for (const c of micChunkQueue.current) total += c.length;
          const combined = new Uint8Array(total); let off = 0; for (const c of micChunkQueue.current) { combined.set(c, off); off += c.length; }
          // Remove noisy audio chunk processing logs
          micChunkQueue.current = [];
          
          if (streamingEnabledRef.current) {
            onMicData(arrayBufferToBase64(combined.buffer), 'audio/pcm');
          }
        }, AUDIO_CONSTANTS.MIC_FLUSH_MS);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      addLog(LogLevelEnum.Error, `Error starting microphone: ${message}`, err);
    }
  }, [addLog, onMicData, onLevel, onPlaybackDrained]);

  const stopMic = useCallback(() => {
    // Detach worklet/script callbacks first to prevent further queueing
    try {
      const node: unknown = recorderNode.current as unknown;
      // AudioWorkletNode has .port.onmessage
      const asWorklet = node as { port?: { onmessage?: unknown } };
      if (asWorklet && asWorklet.port) { asWorklet.port.onmessage = undefined; }
      // ScriptProcessorNode fallback has .onaudioprocess
      const asScript = node as { onaudioprocess?: unknown };
      if (asScript && typeof asScript.onaudioprocess !== 'undefined') { asScript.onaudioprocess = undefined as unknown as (e: unknown) => void; }
    } catch {}

    // Disconnect nodes and stop input tracks
    try { recorderNode.current?.disconnect(); } catch {}
    recorderNode.current = null;
    try { micStreamRef.current?.getTracks().forEach(t => t.stop()); } catch {}
    micStreamRef.current = null;
    try { audioPlayerNode.current?.disconnect(); } catch {}
    audioPlayerNode.current = null;

    // Stop timers and clear any buffered data
    if (micFlushTimer.current != null) { try { window.clearInterval(micFlushTimer.current); } catch {} micFlushTimer.current = null; }
    micChunkQueue.current = [];

    // Proactively close AudioContexts to terminate worklets and avoid zombie processing
    try { void recorderContext.current?.close(); } catch {}
    try { void playerContext.current?.close(); } catch {}
    recorderContext.current = null;
    playerContext.current = null;
  }, []);

  const playAudioChunk = useCallback((base64Data: string) => {
    if (!audioPlayerNode.current) { return; }
    const pcmBytes = base64ToUint8Array(base64Data);
    audioPlayerNode.current.port.postMessage(pcmBytes.buffer);
  }, []);

  const clearPlaybackQueue = useCallback(() => { if (audioPlayerNode.current) audioPlayerNode.current.port.postMessage({ command: 'endOfAudio' }); }, []);

  useEffect(() => () => { stopMic(); }, [stopMic]);

  return { startMic, stopMic, playAudioChunk, clearPlaybackQueue, setStreamingEnabled };
}

// Audio playback management with intelligent priority system
export function useAudioPlayback(
  addLog: (level: LogLevel, message: string, data?: unknown) => void
) {
  const toolSoundRef = useRef<HTMLAudioElement | null>(null);
  const connectedSoundRef = useRef<HTMLAudioElement | null>(null);
  const toolLoopingRef = useRef<boolean>(false);
  const toolCallActiveRef = useRef<boolean>(false);
  const thinkingTimeoutRef = useRef<number | null>(null);
  const modelAudioTimerRef = useRef<number | null>(null);

  // Audio state tracking
  const audioStateRef = useRef({
    currentPriority: 'NONE' as 'NONE' | 'TOOL_SOUND' | 'MODEL_AUDIO',
    toolCallPending: false, // True when tool call is active but sound might be interrupted
    modelAudioPlaying: false, // True when model audio is currently being played
    resumeToolSoundAfterModel: false // True when we should resume tool sound after model audio
  });

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
      const state = audioStateRef.current;

      addLog(LogLevelEnum.Audio, 'Attempting to start tool sound', {
        soundExists: !!sound,
        currentPriority: state.currentPriority,
        modelAudioPlaying: state.modelAudioPlaying,
        toolCallPending: state.toolCallPending,
        resumeToolSoundAfterModel: state.resumeToolSoundAfterModel
      });

      // Don't start tool sound if model audio is currently playing
      if (!sound || state.modelAudioPlaying) {
        // Mark that we want to resume tool sound after model audio finishes
        if (state.toolCallPending) {
          state.resumeToolSoundAfterModel = true;
          addLog(LogLevelEnum.Audio, 'Tool sound deferred - model audio playing, will resume after');
        } else {
          addLog(LogLevelEnum.Audio, 'Tool sound blocked - model audio playing');
        }
        return;
      }

      // Start tool sound
      sound.loop = true;
      sound.currentTime = 0;
      toolLoopingRef.current = true;
      state.currentPriority = 'TOOL_SOUND';
      state.resumeToolSoundAfterModel = false; // Clear the resume flag

      addLog(LogLevelEnum.Audio, 'Starting tool sound loop');
      void sound.play().catch((err) => {
        addLog(LogLevelEnum.Audio, 'Tool loop play blocked (autoplay)', err);
      });
    } catch (err) {
      addLog(LogLevelEnum.Audio, 'Failed to start tool sound', err);
    }
  }, [addLog]);

  const stopToolSound = useCallback(() => {
    try {
      const sound = toolSoundRef.current;
      const state = audioStateRef.current;

      if (!sound) return;

      sound.loop = false;
      sound.pause();
      sound.currentTime = 0;
      toolLoopingRef.current = false;

      // Reset priority if tool sound was playing
      if (state.currentPriority === 'TOOL_SOUND') {
        state.currentPriority = 'NONE';
      }

      addLog(LogLevelEnum.Audio, 'Stopped tool sound');
    } catch (err) {
      addLog(LogLevelEnum.Audio, 'Failed to stop tool sound', err);
    }
  }, [addLog]);

  const playModelAudio = useCallback(() => {
    const state = audioStateRef.current;

    addLog(LogLevelEnum.Audio, 'Playing model audio', {
      currentPriority: state.currentPriority,
      toolCallPending: state.toolCallPending,
      resumeToolSoundAfterModel: state.resumeToolSoundAfterModel
    });

    // Model audio always takes priority
    const wasToolSoundPlaying = state.currentPriority === 'TOOL_SOUND';
    state.currentPriority = 'MODEL_AUDIO';
    state.modelAudioPlaying = true;

    // Stop tool sound if playing, but remember to resume it after if tool call is still active
    if (wasToolSoundPlaying) {
      if (state.toolCallPending) {
        state.resumeToolSoundAfterModel = true;
        addLog(LogLevelEnum.Audio, 'Tool sound interrupted by model audio - will resume after');
      }
      stopToolSound();
    }
  }, [stopToolSound, addLog]);

  const endModelAudio = useCallback(() => {
    const state = audioStateRef.current;

    addLog(LogLevelEnum.Audio, 'Model audio ended', {
      toolCallPending: state.toolCallPending,
      resumeToolSoundAfterModel: state.resumeToolSoundAfterModel
    });

    // Model audio ended
    state.modelAudioPlaying = false;
    state.currentPriority = 'NONE';

    // Resume tool sound if we were supposed to and tool call is still active
    if (state.resumeToolSoundAfterModel && state.toolCallPending && !toolLoopingRef.current) {
      state.resumeToolSoundAfterModel = false;
      addLog(LogLevelEnum.Audio, 'Resuming tool sound after model audio ended');
      startToolSound();
    }
  }, [startToolSound, addLog]);

  const keepModelAudioAlive = useCallback((durationMs: number = AUDIO_CONSTANTS.MODEL_AUDIO_KEEP_ALIVE_MS) => {
    try {
      // Ensure model audio has priority
      playModelAudio();
      // Reset debounce timer so only the last frame ends the model audio state
      if (modelAudioTimerRef.current) {
        window.clearTimeout(modelAudioTimerRef.current);
        modelAudioTimerRef.current = null;
      }
      modelAudioTimerRef.current = window.setTimeout(() => {
        endModelAudio();
      }, durationMs);
    } catch (err) {
      addLog(LogLevelEnum.Audio, 'keepModelAudioAlive error', err);
    }
  }, [playModelAudio, endModelAudio, addLog]);

  const startToolCall = useCallback(() => {
    const state = audioStateRef.current;

    toolCallActiveRef.current = true;
    state.toolCallPending = true;

    addLog(LogLevelEnum.Audio, 'Starting tool call', {
      toolCallActive: toolCallActiveRef.current,
      toolCallPending: state.toolCallPending
    });

    startToolSound();

    // Set timeout for tool call completion
    if (thinkingTimeoutRef.current) {
      window.clearTimeout(thinkingTimeoutRef.current);
    }
    thinkingTimeoutRef.current = window.setTimeout(() => {
      addLog(LogLevelEnum.Event, 'Tool call timeout - ending tool call');
      endToolCall();
    }, AUDIO_CONSTANTS.TOOL_CALL_TIMEOUT_MS);
  }, [addLog, startToolSound]);

  const endToolCall = useCallback(() => {
    const state = audioStateRef.current;

    toolCallActiveRef.current = false;
    state.toolCallPending = false;
    state.resumeToolSoundAfterModel = false; // Clear any pending resume

    addLog(LogLevelEnum.Audio, 'Ending tool call', {
      toolCallActive: toolCallActiveRef.current,
      toolCallPending: state.toolCallPending
    });

    stopToolSound();

    if (thinkingTimeoutRef.current) {
      window.clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }
  }, [addLog, stopToolSound]);

  const cleanup = useCallback(() => {
    const state = audioStateRef.current;

    stopToolSound();
    toolCallActiveRef.current = false;
    state.toolCallPending = false;
    state.resumeToolSoundAfterModel = false;
    state.modelAudioPlaying = false;
    state.currentPriority = 'NONE';

    if (thinkingTimeoutRef.current) {
      window.clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }
    if (modelAudioTimerRef.current) {
      window.clearTimeout(modelAudioTimerRef.current);
      modelAudioTimerRef.current = null;
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
    keepModelAudioAlive,
    startToolCall,
    endToolCall,
    cleanup,
    isToolSoundPlaying: () => toolLoopingRef.current,
    isToolCallActive: () => toolCallActiveRef.current
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

