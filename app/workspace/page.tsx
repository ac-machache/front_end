"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/components/auth/AuthProvider"
import { Button } from "@/components/ui/button"
import { BubblesSolid, CalendarSolid } from "@mynaui/icons-react"
import { Mail } from "lucide-react"
import { useGoogleAuth } from "@/lib/hooks/useGoogleAuth"

export default function WorkspacePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [selectedClientId, setSelectedClientId] = React.useState<string | null>(null)
  const { status: googleAuthStatus, loading: googleAuthLoading } = useGoogleAuth()
  const isGoogleAuthorized = !!googleAuthStatus?.is_connected

  // Get selected client from localStorage (set by sidebar)
  React.useEffect(() => {
    const updateClientId = () => {
      const storedClientId = localStorage.getItem('selectedClientId')
      setSelectedClientId(storedClientId)
    }
    
    // Initial load
    updateClientId()
    
    // Listen for storage changes (when sidebar updates selection)
    window.addEventListener('storage', updateClientId)
    
    // Also poll for changes (in case storage event doesn't fire on same tab)
    const interval = setInterval(updateClientId, 500)
    
    return () => {
      window.removeEventListener('storage', updateClientId)
      clearInterval(interval)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center text-sm text-muted-foreground">
        Chargement…
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center text-sm text-muted-foreground">
        Vous devez être connecté pour accéder à cet espace.
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-4xl flex-col gap-10 p-6 md:py-12">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Espace de travail</p>
        <h1 className="text-3xl font-semibold">
          Bonjour {user.displayName ? `${user.displayName}` : "!"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Ici, vous retrouverez bientôt une vue d’ensemble de vos exploitations, sessions et actions à venir.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-dashed border-muted-foreground/40 bg-muted/10 p-5">
          <h2 className="text-lg font-medium">Activité du jour</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Nous préparerons ici un récapitulatif rapide : rendez-vous planifiés, dernières notes et indicateurs clés.
          </p>
        </div>
        <div className="rounded-lg border border-dashed border-muted-foreground/40 bg-muted/10 p-5">
          <h2 className="text-lg font-medium">À venir</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Suivi des sessions en direct avec synthèse audio.</li>
            <li>Recommandations agronomiques personnalisées.</li>
            <li>Intégration des documents partagés avec vos clients.</li>
          </ul>
        </div>
      </section>

      <section className="rounded-lg border border-dashed border-muted-foreground/40 bg-muted/10 p-5">
        <h2 className="text-lg font-medium">Comment puis-je vous aider ?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          AgriDesk est votre assistant intelligent. Il peut consulter vos anciens rapports de visite, rédiger des emails personnalisés,
          gérer votre agenda (ajouter, consulter et mettre à jour des événements), et utiliser vos notes sauvegardées pour enrichir
          vos communications et automatiser votre suivi client.
        </p>

        {/* Google Authorization Required Warning */}
        {!googleAuthLoading && !isGoogleAuthorized && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-3">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              📋 Autorisations Google requises
            </p>
            <p className="text-xs text-blue-800 dark:text-blue-200">
              Pour utiliser AgriDesk, vous devez d&apos;abord autoriser l&apos;accès à :
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-blue-900 dark:text-blue-100">
                <CalendarSolid className="h-4 w-4" />
                <span>Google Calendar - Gérer vos événements</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-900 dark:text-blue-100">
                <Mail className="h-4 w-4" />
                <span>Gmail - Envoyer des emails</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-col items-end gap-2">
          {!selectedClientId && (
            <p className="text-xs text-muted-foreground">Sélectionnez un client dans la barre latérale pour activer AgriDesk</p>
          )}
          <Button
            size="default"
            className="inline-flex items-center justify-center h-10 px-5 gap-2 rounded-full text-sm"
            onClick={() => router.push(selectedClientId ? `/assistant/google?clientId=${selectedClientId}` : '/assistant/google')}
            disabled={!selectedClientId || googleAuthLoading}
          >
            <BubblesSolid className="h-4 w-4" />
            <span>{isGoogleAuthorized ? 'Ouvrir AgriDesk' : 'Autoriser et ouvrir AgriDesk'}</span>
          </Button>
        </div>
      </section>
    </div>
  )
}


