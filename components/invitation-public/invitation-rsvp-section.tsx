'use client'

import { useState } from 'react'

interface PublicGuest {
  id: string
  name: string
  status: string
}

interface InvitationRsvpSectionProps {
  slug: string
  guests: PublicGuest[]
}

type RsvpState = 'idle' | 'loading' | 'success' | 'error'

export default function InvitationRsvpSection({ slug, guests }: InvitationRsvpSectionProps) {
  const [responses, setResponses] = useState<Record<string, 'confirmed' | 'declined'>>(() => {
    const initial: Record<string, 'confirmed' | 'declined'> = {}
    for (const g of guests) {
      if (g.status === 'confirmed' || g.status === 'declined') {
        initial[g.id] = g.status
      }
    }
    return initial
  })
  const [message, setMessage] = useState('')
  const [state, setState] = useState<RsvpState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (guests.length === 0) {
    return (
      <section className="flex flex-col items-center px-6 py-12 text-center space-y-4">
        <div className="rounded-lg bg-card p-8 shadow-sm max-w-md w-full space-y-3">
          <h2 className="font-serif text-2xl text-foreground">Confirma tu asistencia</h2>
          <p className="text-muted-foreground">
            Contacta a los novios para confirmar tu asistencia.
          </p>
        </div>
      </section>
    )
  }

  const setGuestStatus = (guestId: string, status: 'confirmed' | 'declined') => {
    setResponses((prev) => ({ ...prev, [guestId]: status }))
  }

  const hasSelections = Object.keys(responses).length > 0

  const handleSubmit = async () => {
    if (!hasSelections) return

    setState('loading')
    setErrorMessage(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const entries = Object.entries(responses)

      for (let i = 0; i < entries.length; i++) {
        const [guestId, status] = entries[i]
        const body: Record<string, string> = { guestId, status }
        // attach message only to the first guest
        if (i === 0 && message.trim()) {
          body.message = message.trim()
        }

        const res = await fetch(`${apiUrl}/api/v1/public/invitations/${slug}/rsvp`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => null)
          throw new Error(data?.error?.message ?? `Error al confirmar ${guests.find((g) => g.id === guestId)?.name}`)
        }
      }

      setState('success')
    } catch (err) {
      setState('error')
      setErrorMessage(err instanceof Error ? err.message : 'Error al enviar las respuestas.')
    }
  }

  if (state === 'success') {
    return (
      <section className="flex flex-col items-center px-6 py-12 text-center space-y-4">
        <div className="rounded-lg bg-card p-8 shadow-sm max-w-md w-full space-y-3">
          <h2 className="font-serif text-2xl text-foreground">Gracias</h2>
          <p className="text-muted-foreground">
            Tus respuestas han sido registradas. La pareja ha sido notificada.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="flex flex-col items-center px-6 py-12 text-center space-y-6">
      <h2 className="font-serif text-2xl text-foreground">Confirma tu asistencia</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        Selecciona la respuesta para cada invitado.
      </p>

      <div className="max-w-md w-full space-y-3">
        {guests.map((guest) => {
          const selected = responses[guest.id] ?? null
          return (
            <div
              key={guest.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4"
            >
              <span className="text-sm font-medium text-foreground">{guest.name}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setGuestStatus(guest.id, 'confirmed')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    selected === 'confirmed'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  Asistira
                </button>
                <button
                  type="button"
                  onClick={() => setGuestStatus(guest.id, 'declined')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    selected === 'declined'
                      ? 'bg-destructive text-destructive-foreground shadow-sm'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  No podra
                </button>
              </div>
            </div>
          )
        })}

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mensaje para los novios (opcional)"
          maxLength={500}
          rows={3}
          className="w-full rounded-lg border border-input bg-background px-4 py-3
                     text-foreground placeholder:text-muted-foreground resize-none
                     focus:outline-none focus:ring-2 focus:ring-primary/50"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={state === 'loading' || !hasSelections}
          className="w-full rounded-lg bg-primary text-primary-foreground py-3
                     font-medium transition-opacity hover:opacity-90
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state === 'loading' ? 'Enviando...' : 'Confirmar respuestas'}
        </button>

        {state === 'error' && errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}
      </div>
    </section>
  )
}
