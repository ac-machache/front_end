"use client"

import * as React from "react"

import { useAuth } from "@/components/auth/AuthProvider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { addClientForUser } from "@/lib/firebase"
import type { ClientFormValues } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function CreateClientPage() {
  const { user, loading } = useAuth()

  const [form, setForm] = React.useState<ClientFormValues>({
    name: "",
    email: "",
    city: "",
    zipCode: "",
    contexte: "",
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const updateField = <K extends keyof ClientFormValues>(field: K, value: ClientFormValues[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canSubmit = Object.values(form).every((value) => value.trim() !== "")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user?.uid || !canSubmit) return

    setIsSubmitting(true)
    setSuccessMessage(null)
    setErrorMessage(null)
    try {
      await addClientForUser(user.uid, {
        name: form.name.trim(),
        email: form.email.trim(),
        city: form.city.trim(),
        zipCode: form.zipCode.trim(),
        contexte: form.contexte.trim(),
      })
      setSuccessMessage("Client créé avec succès.")
      setForm({ name: "", email: "", city: "", zipCode: "", contexte: "" })
    } catch (error) {
      console.error(error)
      setErrorMessage("Impossible de créer le client. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

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
        Vous devez être connecté pour créer un client.
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl flex-col gap-6 p-6 md:py-12">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Clients</p>
        <h1 className="text-3xl font-semibold">Créer un nouveau client</h1>
        <p className="text-sm text-muted-foreground">
          Renseignez les informations principales pour préparer vos futures interactions avec ce client.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
          <CardDescription>Ces informations vous aident à contextualiser vos échanges.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client-name">Nom</Label>
                <Input
                  id="client-name"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Nom du client"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-email">E‑mail</Label>
                <Input
                  id="client-email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="client@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-city">Ville</Label>
                <Input
                  id="client-city"
                  value={form.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  placeholder="Ville"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-zip">Code postal</Label>
                <Input
                  id="client-zip"
                  value={form.zipCode}
                  onChange={(event) => updateField("zipCode", event.target.value)}
                  placeholder="Code postal"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-context">Contexte</Label>
              <Textarea
                id="client-context"
                value={form.contexte}
                onChange={(event) => updateField("contexte", event.target.value)}
                className="min-h-40"
                placeholder={`Ex :
Exploitant : Sarah Lefèvre
Superficie : 60 ha de prairie permanente et maïs ensilage.
Activité : élevage de 50 vaches laitières.
Objectifs : renforcer l'autonomie fourragère.`}
              />
            </div>

            {successMessage ? (
              <p className="text-sm font-medium text-emerald-500">{successMessage}</p>
            ) : null}
            {errorMessage ? (
              <p className="text-sm font-medium text-destructive">{errorMessage}</p>
            ) : null}

            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="rounded-full px-6"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Créer le client
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


