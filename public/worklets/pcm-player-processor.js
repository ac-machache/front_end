class PCMPlayerProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 24000 * 180;
    this.buffer = new Float32Array(this.bufferSize);
    this.writeIndex = 0;
    this.readIndex = 0;
    this.port.onmessage = (event) => {
      if (event.data?.command === 'endOfAudio') { this.readIndex = this.writeIndex; return; }
      if (event.data instanceof ArrayBuffer) {
        const int16 = new Int16Array(event.data);
        for (let i = 0; i < int16.length; i++) {
          const f = int16[i] / 32768;
          this.buffer[this.writeIndex] = f;
          this.writeIndex = (this.writeIndex + 1) % this.bufferSize;
          if (this.writeIndex === this.readIndex) this.readIndex = (this.readIndex + 1) % this.bufferSize;
        }
      }
    };
  }
  process(inputs, outputs) {
    const output = outputs[0];
    const n = output[0].length;
    for (let i = 0; i < n; i++) {
      output[0][i] = this.buffer[this.readIndex];
      if (output.length > 1) output[1][i] = this.buffer[this.readIndex];
      if (this.readIndex !== this.writeIndex) this.readIndex = (this.readIndex + 1) % this.bufferSize;
    }
    return true;
  }
}
registerProcessor('pcm-player-processor', PCMPlayerProcessor);

