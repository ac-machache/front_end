// Ambient declarations for public JS modules under /public/js

declare module '/js/audio-player.js' {
  export function startAudioPlayerWorklet(): Promise<[AudioWorkletNode, AudioContext]>;
}

declare module '/js/audio-recorder.js' {
  export function startAudioRecorderWorklet(
    onPcm16Chunk: (buf: ArrayBuffer) => void
  ): Promise<[AudioWorkletNode, AudioContext, MediaStream]>;
  export function stopMicrophone(): void;
}


