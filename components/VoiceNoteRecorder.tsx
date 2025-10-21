"use client"

import { useState } from "react"
import { useVoiceRecorder } from "@/lib/hooks/useVoiceRecorder"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MicrophoneSolid, PauseSolid, PlaySolid, StopSolid, XSolid } from "@mynaui/icons-react"
import { cn } from "@/lib/utils"

interface VoiceNoteRecorderProps {
  onComplete: (audioBlob: Blob, base64: string) => void
  onCancel: () => void
  disabled?: boolean
}

export function VoiceNoteRecorder({ onComplete, onCancel, disabled }: VoiceNoteRecorderProps) {
  const [error, setError] = useState<string | null>(null)

  const {
    isRecording,
    isPaused,
    recordingTime,
    audioLevel,
    formattedTime,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
  } = useVoiceRecorder({
    onRecordingComplete: (audioBlob, base64) => {
      onComplete(audioBlob, base64)
    },
    onError: (error) => {
      setError(error.message)
      console.error('Recording error:', error)
    },
  })

  const handleStart = async () => {
    setError(null)
    await startRecording()
  }

  const handleCancel = () => {
    cancelRecording()
    onCancel()
  }

  if (!isRecording) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <MicrophoneSolid className="size-10 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Enregistrer une note vocale</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Appuyez sur le bouton pour commencer l&apos;enregistrement
              </p>
            </div>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                {error}
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={handleStart} disabled={disabled} size="lg" className="gap-2">
                <MicrophoneSolid className="size-4" />
                Commencer l&apos;enregistrement
              </Button>
              <Button onClick={onCancel} variant="outline" size="lg">
                Annuler
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-6">
          {/* Animated microphone with audio level */}
          <div className="relative">
            <div 
              className={cn(
                "flex h-24 w-24 items-center justify-center rounded-full transition-all duration-200",
                isPaused ? "bg-muted" : "bg-primary/10"
              )}
              style={{
                transform: `scale(${1 + audioLevel * 0.2})`,
              }}
            >
              <MicrophoneSolid 
                className={cn(
                  "size-12 transition-colors",
                  isPaused ? "text-muted-foreground" : "text-primary"
                )} 
              />
            </div>
            {!isPaused && (
              <div className="absolute -inset-2 rounded-full border-2 border-primary/30 animate-ping" />
            )}
          </div>

          {/* Recording time */}
          <div className="text-center">
            <div className="text-3xl font-bold font-mono tabular-nums">
              {formattedTime}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {isPaused ? "En pause" : "Enregistrement en cours..."}
            </p>
          </div>

          {/* Audio level indicator */}
          {!isPaused && (
            <div className="w-full max-w-xs">
              <Progress value={audioLevel * 100} className="h-2" />
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-2">
            {!isPaused ? (
              <Button onClick={pauseRecording} variant="outline" size="lg" className="gap-2">
                <PauseSolid className="size-4" />
                Pause
              </Button>
            ) : (
              <Button onClick={resumeRecording} variant="outline" size="lg" className="gap-2">
                <PlaySolid className="size-4" />
                Reprendre
              </Button>
            )}
            
            <Button onClick={stopRecording} size="lg" className="gap-2">
              <StopSolid className="size-4" />
              Terminer
            </Button>

            <Button onClick={handleCancel} variant="destructive" size="lg" className="gap-2">
              <XSolid className="size-4" />
              Annuler
            </Button>
          </div>

          {recordingTime >= 300 && (
            <div className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-3 py-2 rounded-md">
              ⚠️ L&apos;enregistrement dépasse 5 minutes. Pensez à le terminer bientôt.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

