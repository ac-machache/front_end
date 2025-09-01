let micStream;

export async function startAudioRecorderWorklet(onPcmBuffer) {
  const audioRecorderContext = new AudioContext({ sampleRate: 24000 });
  const workletURL = '/worklets/pcm-recorder-processor.js';
  const canUseWorklet = !!(audioRecorderContext.audioWorklet && typeof audioRecorderContext.audioWorklet.addModule === 'function' && typeof AudioWorkletNode !== 'undefined');

  if (canUseWorklet) {
    await audioRecorderContext.audioWorklet.addModule(workletURL);
  }

  micStream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1 } });
  const source = audioRecorderContext.createMediaStreamSource(micStream);

  if (canUseWorklet) {
    const audioRecorderNode = new AudioWorkletNode(audioRecorderContext, 'pcm-recorder-processor');
    source.connect(audioRecorderNode);
    audioRecorderNode.port.onmessage = (event) => {
      const pcm16 = convertFloat32ToPCM(event.data);
      onPcmBuffer(pcm16);
    };
    return [audioRecorderNode, audioRecorderContext, micStream];
  } else {
    const processor = audioRecorderContext.createScriptProcessor(4096, 1, 1);
    source.connect(processor);
    // Ensure the processor keeps running on some browsers
    processor.connect(audioRecorderContext.destination);
    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const copy = new Float32Array(input.length);
      copy.set(input);
      const pcm16 = convertFloat32ToPCM(copy);
      onPcmBuffer(pcm16);
    };
    return [processor, audioRecorderContext, micStream];
  }
}

export function stopMicrophone(stream) {
  (stream || micStream)?.getTracks().forEach((t) => t.stop());
}

function convertFloat32ToPCM(inputData) {
  const pcm16 = new Int16Array(inputData.length);
  for (let i = 0; i < inputData.length; i++) {
    pcm16[i] = inputData[i] * 0x7fff;
  }
  return pcm16.buffer;
}

