"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Sparkles, Loader2 } from "lucide-react"
import { createInvitation } from "@/lib/api"
import { toast } from "sonner"

export function CreateFirstInvitation() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [location, setLocation] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [nameError, setNameError] = useState("")

  const handleCreate = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setNameError("El nombre es obligatorio")
      return
    }
    setNameError("")
    setSubmitting(true)
    try {
      await createInvitation({
        name: trimmed,
        eventDate: eventDate || null,
        location: location.trim() || null,
      })
      toast.success("Invitacion creada")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al crear la invitacion")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
        </div>
        <CardTitle className="font-serif">Crea tu invitacion</CardTitle>
        <CardDescription>
          Ingresa los datos basicos de tu boda. Podras personalizar el diseno despues.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="couple-name">Nombres de la pareja</Label>
          <Input
            id="couple-name"
            placeholder="ej. Ana Garcia & Carlos Lopez"
            value={name}
            onChange={(e) => { setName(e.target.value); setNameError("") }}
          />
          {nameError && <p className="text-xs text-destructive">{nameError}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="event-date">Fecha de la boda (opcional)</Label>
          <Input
            id="event-date"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="event-location">Lugar (opcional)</Label>
          <Input
            id="event-location"
            placeholder="ej. Hacienda San Jose, Tlajomulco"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <Button onClick={handleCreate} disabled={submitting} className="w-full">
          {submitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creando...</>
          ) : (
            "Crear mi invitacion"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
