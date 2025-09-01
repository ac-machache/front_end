class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }
  process(inputs) {
    if (inputs.length > 0 && inputs[0].length > 0) {
      const inputChannel = inputs[0][0];
      const copy = new Float32Array(inputChannel);
      this.port.postMessage(copy);
    }
    return true;
  }
}
registerProcessor('pcm-recorder-processor', PCMProcessor);

