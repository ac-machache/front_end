"use client";
import { useEffect, useCallback, useRef } from 'react';
import { LogLevel } from '../types';
import { arrayBufferToBase64, base64ToUint8Array } from '../utils';

export const AUDIO_CONSTANTS = {
  MIC_FLUSH_MS: 50,
  HEARTBEAT_TIMEOUT_MS: 20000,
  MODEL_AUDIO_KEEP_ALIVE_MS: 500,
  TOOL_CALL_TIMEOUT_MS: 120000,
  VISIBILITY_GRACE_MS: 12000,
} as const;

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
        addLog(LogLevel.Audio, 'Starting microphone flush timer');
        micFlushTimer.current = window.setInterval(() => {
          const queueLength = micChunkQueue.current.length;
          // Reduced verbosity: keep minimal tick info only when troubleshooting
          // addLog(LogLevel.Audio, 'Timer tick', {
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
      addLog(LogLevel.Error, `Error starting microphone: ${message}`, err);
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
      addLog(LogLevel.Error, 'Failed to initialize audio files', err);
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
      addLog(LogLevel.Audio, 'Failed to play connected sound', err);
    }
  }, [addLog]);

  const startToolSound = useCallback(() => {
    try {
      const sound = toolSoundRef.current;
      const state = audioStateRef.current;

      addLog(LogLevel.Audio, 'Attempting to start tool sound', {
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
          addLog(LogLevel.Audio, 'Tool sound deferred - model audio playing, will resume after');
        } else {
          addLog(LogLevel.Audio, 'Tool sound blocked - model audio playing');
        }
        return;
      }

      // Start tool sound
      sound.loop = true;
      sound.currentTime = 0;
      toolLoopingRef.current = true;
      state.currentPriority = 'TOOL_SOUND';
      state.resumeToolSoundAfterModel = false; // Clear the resume flag

      addLog(LogLevel.Audio, 'Starting tool sound loop');
      void sound.play().catch((err) => {
        addLog(LogLevel.Audio, 'Tool loop play blocked (autoplay)', err);
      });
    } catch (err) {
      addLog(LogLevel.Audio, 'Failed to start tool sound', err);
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

      addLog(LogLevel.Audio, 'Stopped tool sound');
    } catch (err) {
      addLog(LogLevel.Audio, 'Failed to stop tool sound', err);
    }
  }, [addLog]);

  const playModelAudio = useCallback(() => {
    const state = audioStateRef.current;

    addLog(LogLevel.Audio, 'Playing model audio', {
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
        addLog(LogLevel.Audio, 'Tool sound interrupted by model audio - will resume after');
      }
      stopToolSound();
    }
  }, [stopToolSound, addLog]);

  const endModelAudio = useCallback(() => {
    const state = audioStateRef.current;

    addLog(LogLevel.Audio, 'Model audio ended', {
      toolCallPending: state.toolCallPending,
      resumeToolSoundAfterModel: state.resumeToolSoundAfterModel
    });

    // Model audio ended
    state.modelAudioPlaying = false;
    state.currentPriority = 'NONE';

    // Resume tool sound if we were supposed to and tool call is still active
    if (state.resumeToolSoundAfterModel && state.toolCallPending && !toolLoopingRef.current) {
      state.resumeToolSoundAfterModel = false;
      addLog(LogLevel.Audio, 'Resuming tool sound after model audio ended');
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
      addLog(LogLevel.Audio, 'keepModelAudioAlive error', err);
    }
  }, [playModelAudio, endModelAudio, addLog]);

  const endToolCall = useCallback(() => {
    const state = audioStateRef.current;

    toolCallActiveRef.current = false;
    state.toolCallPending = false;
    state.resumeToolSoundAfterModel = false; // Clear any pending resume

    addLog(LogLevel.Audio, 'Ending tool call', {
      toolCallActive: toolCallActiveRef.current,
      toolCallPending: state.toolCallPending
    });

    stopToolSound();

    if (thinkingTimeoutRef.current) {
      window.clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }
  }, [addLog, stopToolSound]);

  const startToolCall = useCallback(() => {
    const state = audioStateRef.current;

    toolCallActiveRef.current = true;
    state.toolCallPending = true;

    addLog(LogLevel.Audio, 'Starting tool call', {
      toolCallActive: toolCallActiveRef.current,
      toolCallPending: state.toolCallPending
    });

    startToolSound();

    // Set timeout for tool call completion
    if (thinkingTimeoutRef.current) {
      window.clearTimeout(thinkingTimeoutRef.current);
    }
    thinkingTimeoutRef.current = window.setTimeout(() => {
      addLog(LogLevel.Event, 'Tool call timeout - ending tool call');
      endToolCall();
    }, AUDIO_CONSTANTS.TOOL_CALL_TIMEOUT_MS);
  }, [addLog, startToolSound, endToolCall]);

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