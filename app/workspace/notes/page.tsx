"use client"

import { useEffect, useState, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth/AuthProvider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
import { Loader } from "@/components/ai-elements/loader"
import { ClipboardSolid, TrashOneSolid, PlaySolid } from "@mynaui/icons-react"
import { VoiceAnimation } from "@/components/VoiceAnimation"
import { useVADRecorder } from "@/lib/hooks/useVADRecorder"
import { listNotesForClient, setClientNoteDoc, getClientById, listSessionsForClient, deleteClientNoteDoc, type NotePayload } from "@/lib/firebase"
import { useApiClient } from "@/lib/hooks/useApiClient"
import { useLogger } from "@/lib/hooks/useLogger"
import { format } from "date-fns"
import ReactMarkdown from "react-markdown"

interface Note {
  id: string
  title: string
  date_de_visite: string
  date_de_creation: string
  Content: string
  audioData?: string
  sessionId?: string
}

function NotesPageContent() {
  // const router = useRouter()
  const searchParams = useSearchParams()
  const clientId = searchParams.get("clientId")
  const { user } = useAuth()

  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [_clientName, setClientName] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null)

  const { addLog } = useLogger()
  const apiClient = useApiClient(
    {
      scheme: 'wss',
      host: '',
      port: '',
      appName: process.env.NEXT_PUBLIC_APP_NAME || 'app',
      userId: user?.uid || '',
      sessionId: '', // Not needed for notes API
    },
    addLog
  )

  // Fetch notes
  const fetchNotes = useCallback(async () => {
    if (!user || !clientId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Fetch client name
      const client = await getClientById(user.uid, clientId)
      if (client) {
        setClientName(client.name || '')
      }

      // Fetch notes
      const notesList = await listNotesForClient(user.uid, clientId)
      setNotes(notesList as Note[])
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }, [user, clientId])

  // Handle recording complete with VAD
  const handleVADRecordingComplete = useCallback(async (audioBlob: Blob, base64: string) => {
    if (!user || !clientId) return

    setIsProcessing(true)

    try {
      // Get most recent session date or use today
      let dateDeVisite = format(new Date(), 'dd/MM/yyyy')
      
      const sessions = await listSessionsForClient(user.uid, clientId)
      if (sessions.length > 0) {
        const sortedSessions = sessions.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0
          const bTime = b.createdAt?.toMillis?.() || 0
          return bTime - aTime
        })
        
        if (sortedSessions[0]?.date_de_visite) {
          dateDeVisite = sortedSessions[0].date_de_visite
        }
      }

      // Generate unique session ID for this note
      const noteSessionId = crypto.randomUUID()

      // Call backend to create note
      const result = await apiClient.createNote(noteSessionId, {
        date_de_visite: dateDeVisite,
        audio_data: base64,
      })

      if (!result.ok) {
        throw new Error('Failed to create note')
      }

      if (result.value.result === 'success') {
        const noteData = JSON.parse(result.value.data) as {
          title: string
          date_de_visite: string
          date_de_creation: string
          Content: string
        }

        // Save to Firestore with audio data
        const noteId = crypto.randomUUID()
        const notePayload: NotePayload = {
          ...noteData,
          audioData: base64,
          sessionId: noteSessionId,
        }

        await setClientNoteDoc(user.uid, clientId, noteId, notePayload)

        // Refresh notes list
        await fetchNotes()
      } else {
        throw new Error('Backend returned failure')
      }
    } catch (error) {
      console.error('Error creating note:', error)
      alert('Erreur lors de la création de la note. Veuillez réessayer.')
    } finally {
      setIsProcessing(false)
    }
  }, [user, clientId, apiClient, fetchNotes])

  // Voice Activity Detection recorder with Silero VAD
  const { isListening, isSpeaking, audioLevel, startListening, stopListening } = useVADRecorder({
    onRecordingComplete: async (audioBlob, base64) => {
      await handleVADRecordingComplete(audioBlob, base64)
      // Auto-stop listening after note creation
      stopListening()
    },
    onError: (error) => {
      console.error('Recording error:', error)
      alert('Erreur lors de l\'enregistrement. Veuillez réessayer.')
      // Also stop on error
      stopListening()
    },
  })

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  // Handle delete note
  const handleDeleteNote = useCallback(async (noteId: string) => {
    if (!user || !clientId) return

    if (!confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) return

    try {
      await deleteClientNoteDoc(user.uid, clientId, noteId)
      await fetchNotes()
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('Erreur lors de la suppression de la note.')
    }
  }, [user, clientId, fetchNotes])

  // Handle play audio
  const handlePlayAudio = useCallback((noteId: string, audioData: string) => {
    try {
      // Convert base64 to blob
      const byteCharacters = atob(audioData)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'audio/ogg' })
      
      // Create audio URL and play
      const audioUrl = URL.createObjectURL(blob)
      const audio = new Audio(audioUrl)
      
      audio.onended = () => {
        setPlayingAudioId(null)
        URL.revokeObjectURL(audioUrl)
      }
      
      setPlayingAudioId(noteId)
      audio.play()
    } catch (error) {
      console.error('Error playing audio:', error)
      alert('Erreur lors de la lecture de l\'audio.')
    }
  }, [])

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Non authentifié</CardTitle>
            <CardDescription>
              Vous devez être connecté pour voir les notes.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!clientId) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Aucun client sélectionné</CardTitle>
            <CardDescription>
              Veuillez sélectionner un client dans la barre latérale pour voir ses notes.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      {/* Compact recording section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Notes vocales
        </h1>
        
        {/* Compact voice recorder */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            {isProcessing ? (
              <p className="text-sm font-medium">Traitement...</p>
            ) : isListening ? (
              isSpeaking ? (
                <p className="text-sm font-medium">🎙️ Écoute...</p>
              ) : (
                <p className="text-sm text-muted-foreground">En attente</p>
              )
            ) : (
              <p className="text-sm text-muted-foreground">Enregistrer</p>
            )}
          </div>
          
          <div 
            className="cursor-pointer"
            onClick={() => {
              if (isListening) {
                stopListening()
              } else {
                startListening()
              }
            }}
          >
            <div className="scale-75 origin-center">
              <VoiceAnimation 
                isListening={isListening} 
                isSpeaking={isSpeaking} 
                audioLevel={audioLevel} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notes list */}
      {notes.length === 0 && !isProcessing ? (
        <Card className="border-dashed">
          <CardHeader className="text-center py-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <ClipboardSolid className="size-8 text-primary" />
            </div>
            <CardTitle>Aucune note vocale</CardTitle>
            <CardDescription className="max-w-md mx-auto">
              Tapez sur le microphone ci-dessus pour enregistrer votre première note vocale.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-shadow flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base line-clamp-2 mb-3">{note.title}</CardTitle>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {note.date_de_visite && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Visite:</span>
                        <span>{note.date_de_visite}</span>
                      </div>
                    )}
                    {note.date_de_creation && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Créée:</span>
                        <span>{note.date_de_creation}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {note.Content && (
                    <div className="prose prose-sm max-w-none dark:prose-invert line-clamp-6 flex-1">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="text-xs leading-relaxed mb-1">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-4 space-y-0.5 text-xs">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-4 space-y-0.5 text-xs">{children}</ol>,
                          li: ({ children }) => <li className="text-xs leading-relaxed">{children}</li>,
                          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          h1: ({ children }) => <h1 className="text-sm font-bold mb-1">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-xs font-bold mb-1">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-xs font-bold mb-0.5">{children}</h3>,
                        }}
                      >
                        {note.Content}
                      </ReactMarkdown>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-4 pt-3 border-t">
                    {note.audioData && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePlayAudio(note.id, note.audioData!)}
                        disabled={playingAudioId === note.id}
                        className="gap-2 flex-1"
                      >
                        <PlaySolid className="size-4" />
                        {playingAudioId === note.id ? 'Lecture...' : 'Écouter'}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteNote(note.id)}
                      className="gap-2"
                    >
                      <TrashOneSolid className="size-4" />
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
      ) : null}
    </div>
  )
}

export default function NotesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader /></div>}>
      <NotesPageContent />
    </Suspense>
  )
}
