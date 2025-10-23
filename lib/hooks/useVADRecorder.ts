"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import { MicVAD } from '@ricky0123/vad-web'

export interface VADRecorderOptions {
  onRecordingComplete?: (audioBlob: Blob, base64: string) => void
  onError?: (error: Error) => void
}

export function useVADRecorder({
  onRecordingComplete,
  onError,
}: VADRecorderOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)

  const vadRef = useRef<MicVAD | null>(null)
  const audioChunksRef = useRef<Float32Array[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  
  // Audio feedback for speech start/end
  const lockAudioRef = useRef<HTMLAudioElement | null>(null)
  const unlockAudioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio elements
  useEffect(() => {
    lockAudioRef.current = new Audio('/Lock.mp3')
    unlockAudioRef.current = new Audio('/Unlock.mp3')
    
    return () => {
      lockAudioRef.current = null
      unlockAudioRef.current = null
    }
  }, [])

  // Convert Float32Array to Blob (audio/wav format)
  const float32ArrayToBlob = useCallback((audioData: Float32Array, sampleRate: number = 16000): Blob => {
    // Create WAV file from Float32Array
    const wavBuffer = new ArrayBuffer(44 + audioData.length * 2)
    const view = new DataView(wavBuffer)

    // Write WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }

    writeString(0, 'RIFF')
    view.setUint32(4, 36 + audioData.length * 2, true)
    writeString(8, 'WAVE')
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true) // PCM chunk size
    view.setUint16(20, 1, true) // PCM format
    view.setUint16(22, 1, true) // Mono
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * 2, true) // Byte rate
    view.setUint16(32, 2, true) // Block align
    view.setUint16(34, 16, true) // Bits per sample
    writeString(36, 'data')
    view.setUint32(40, audioData.length * 2, true)

    // Write audio data
    const volume = 0.8
    for (let i = 0; i < audioData.length; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]))
      view.setInt16(44 + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
    }

    return new Blob([wavBuffer], { type: 'audio/wav' })
  }, [])

  // Convert blob to base64
  const blobToBase64 = useCallback((blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        const base64 = base64String.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }, [])

  // Analyze audio level for visualization
  const analyzeAudioLevel = useCallback(() => {
    if (!analyserRef.current) return

    const analyser = analyserRef.current
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(dataArray)

    // Calculate average volume
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
    const normalizedLevel = Math.min(1, average / 128)
    setAudioLevel(normalizedLevel)

    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(analyzeAudioLevel)
  }, [])

  // Start listening
  const startListening = useCallback(async () => {
    console.log('Starting VAD initialization...')
    try {
      // Create MicVAD instance - load model from CDN, WASM files locally
      const vad = await MicVAD.new({
        getStream: async () => {
          return await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          })
        },
        onSpeechStart: () => {
          console.log('Speech start detected')
          setIsSpeaking(true)
          audioChunksRef.current = []
        },
        onSpeechEnd: async (audio: Float32Array) => {
          console.log('Speech end detected', audio.length)
          setIsSpeaking(false)

          // Play Unlock.mp3 to indicate voice sent to be analyzed
          if (unlockAudioRef.current) {
            unlockAudioRef.current.currentTime = 0
            unlockAudioRef.current.play().catch(err => console.error('Error playing unlock sound:', err))
          }

          // Convert Float32Array to Blob
          try {
            const audioBlob = float32ArrayToBlob(audio, 16000)
            const base64 = await blobToBase64(audioBlob)
            onRecordingComplete?.(audioBlob, base64)
          } catch (error) {
            onError?.(error as Error)
          }
        },
        onVADMisfire: () => {
          console.log('VAD misfire')
          setIsSpeaking(false)
        },
        positiveSpeechThreshold: 0.8,
        negativeSpeechThreshold: 0.65,
        submitUserSpeechOnPause: true,
        // Load all files from public directory (copied by webpack)
        baseAssetPath: '/',
        onnxWASMBasePath: '/',
      })

      console.log('VAD initialized successfully')
      vadRef.current = vad

      // Set up audio analysis for visualization
      const stream = vad.stream
      if (stream) {
        const audioContext = new AudioContext()
        const source = audioContext.createMediaStreamSource(stream)
        const analyser = audioContext.createAnalyser()
        analyser.fftSize = 256
        source.connect(analyser)

        audioContextRef.current = audioContext
        analyserRef.current = analyser
        analyzeAudioLevel()
      }

      await vad.start()
      setIsListening(true)
      
      // Play Lock.mp3 to indicate user can start talking
      if (lockAudioRef.current) {
        lockAudioRef.current.currentTime = 0
        lockAudioRef.current.play().catch(err => console.error('Error playing lock sound:', err))
      }
    } catch (error) {
      console.error('Error starting VAD:', error)
      onError?.(error as Error)
    }
  }, [float32ArrayToBlob, blobToBase64, onRecordingComplete, onError, analyzeAudioLevel])

  // Stop listening
  const stopListening = useCallback(async () => {
    if (vadRef.current) {
      await vadRef.current.pause()
      vadRef.current.destroy()
      vadRef.current = null
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    setIsListening(false)
    setIsSpeaking(false)
    setAudioLevel(0)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (vadRef.current) {
        vadRef.current.destroy()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return {
    isListening,
    isSpeaking,
    audioLevel,
    startListening,
    stopListening,
  }
}
