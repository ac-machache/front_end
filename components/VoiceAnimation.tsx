"use client"

import { motion } from "framer-motion"

interface VoiceAnimationProps {
  isListening: boolean
  isSpeaking: boolean
  audioLevel: number
}

export function VoiceAnimation({ isListening, isSpeaking, audioLevel }: VoiceAnimationProps) {
  if (!isListening) {
    // Not listening - show static circle
    return (
      <div className="relative w-32 h-32 flex items-center justify-center">
        <motion.div
          className="bg-primary rounded-full"
          style={{ width: 64, height: 64 }}
          initial={{ scale: 1 }}
          animate={{ scale: 1 }}
        />
      </div>
    )
  }

  if (isSpeaking) {
    // User is speaking - show animated ring
    const rings = [1, 2, 3]
    
    return (
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Solid center circle */}
        <div className="absolute w-16 h-16 bg-primary rounded-full z-10" />
        
        {/* Animated rings */}
        {rings.map((ring, index) => {
          const delay = index * 0.3
          const scale = 1 + (audioLevel * (index + 1) * 0.5)
          
          return (
            <motion.div
              key={ring}
              className="absolute border-2 border-primary rounded-full"
              style={{ width: 64, height: 64 }}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{
                scale: [1, scale, 1],
                opacity: [0.8, 0.3, 0.8],
              }}
              transition={{
                duration: 1.5,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )
        })}
      </div>
    )
  }

  // Listening but not speaking - idle pulsing
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <motion.div
        className="bg-primary rounded-full"
        style={{ width: 64, height: 64 }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

