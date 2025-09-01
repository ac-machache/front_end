export async function createAudioPlayerNode(audioContext) {
  const workletUrl = '/worklets/pcm-player-processor.js';
  await audioContext.audioWorklet.addModule(workletUrl);
  const node = new AudioWorkletNode(audioContext, 'pcm-player-processor');
  node.connect(audioContext.destination);
  return node;
}

export async function startAudioPlayerWorklet() {
  const audioContext = new AudioContext({ sampleRate: 24000 });
  const workletURL = '/worklets/pcm-player-processor.js';
  await audioContext.audioWorklet.addModule(workletURL);
  const audioPlayerNode = new AudioWorkletNode(audioContext, 'pcm-player-processor');
  audioPlayerNode.connect(audioContext.destination);
  return [audioPlayerNode, audioContext];
}

