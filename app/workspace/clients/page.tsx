"use client"

import * as React from "react"

import { useAuth } from "@/components/auth/AuthProvider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { listClientsForUser } from "@/lib/firebase"
import type { ClientRecord } from "@/lib/types"
import { Loader2 } from "lucide-react"
import { UserXSolid } from "@mynaui/icons-react"

export default function ClientProfilesPage() {
  const { user, loading } = useAuth()
  const [clients, setClients] = React.useState<ClientRecord[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true

    async function loadClients() {
      if (!user?.uid) {
        setClients([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const records = (await listClientsForUser(user.uid)) as ClientRecord[]
        if (mounted) {
          setClients(records)
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadClients()

    return () => {
      mounted = false
    }
  }, [user?.uid])

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
        Vous devez être connecté pour consulter vos clients.
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col gap-6 p-6 md:py-12">
      <div>
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Clients</p>
        <h1 className="text-3xl font-semibold">Profils enregistrés</h1>
        <p className="text-sm text-muted-foreground">
          Parcourez vos exploitations, leurs contextes et lancez une session en un clic.
        </p>
      </div>

      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Chargement des clients…
        </div>
      ) : clients.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Aucun client pour l’instant</CardTitle>
            <CardDescription>
              Ajoutez un client pour commencer à enregistrer vos interactions et recommandations.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="rounded-full">
              {/* Removed Link to /workspace/create */}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {clients.map((client) => (
            <Card key={client.id} className="flex h-full flex-col">
              <CardHeader>
                <CardTitle>{client.name}</CardTitle>
                <CardDescription>{client.email}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-3 text-sm text-muted-foreground">
                <div>{client.zipCode} {client.city}</div>
                <div className="whitespace-pre-wrap leading-6">
                  {client.contexte || "Aucun contexte enregistré."}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full gap-2"
                  disabled
                >
                  <UserXSolid className="h-4 w-4" /> Supprimer (bientôt)
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


