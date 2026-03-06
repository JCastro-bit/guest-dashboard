'use client'

import { useState } from 'react'

interface InvitationRsvpSectionProps {
  slug: string
  guestId: string | null
}

type RsvpState = 'idle' | 'loading' | 'success' | 'error'

export default function InvitationRsvpSection({ slug, guestId }: InvitationRsvpSectionProps) {
  const [localGuestId, setLocalGuestId] = useState(guestId ?? '')
  const [selectedStatus, setSelectedStatus] = useState<'confirmed' | 'declined' | null>(null)
  const [message, setMessage] = useState('')
  const [state, setState] = useState<RsvpState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!localGuestId || !selectedStatus) return

    setState('loading')
    setErrorMessage(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const res = await fetch(`${apiUrl}/api/v1/public/invitations/${slug}/rsvp`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId: localGuestId,
          status: selectedStatus,
          ...(message ? { message } : {}),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error?.message ?? 'Error al enviar tu respuesta.')
      }

      const data = await res.json()
      setState('success')
      setSuccessMessage(data.message)
    } catch (err) {
      setState('error')
      setErrorMessage(err instanceof Error ? err.message : 'Error al enviar tu respuesta.')
    }
  }

  if (state === 'success') {
    return (
      <section className="flex flex-col items-center px-6 py-12 text-center space-y-4">
        <div className="rounded-lg bg-card p-8 shadow-sm max-w-md w-full space-y-3">
          <h2 className="font-serif text-2xl text-foreground">Gracias</h2>
          <p className="text-muted-foreground">{successMessage}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="flex flex-col items-center px-6 py-12 text-center space-y-6">
      <h2 className="font-serif text-2xl text-foreground">Confirma tu asistencia</h2>

      <div className="max-w-md w-full space-y-4">
        {!guestId && (
          <input
            type="text"
            value={localGuestId}
            onChange={(e) => setLocalGuestId(e.target.value)}
            placeholder="Codigo de invitado (viene en tu link)"
            className="w-full rounded-lg border border-input bg-background px-4 py-3
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setSelectedStatus('confirmed')}
            className={`flex-1 rounded-lg py-3 font-medium transition-all
              ${selectedStatus === 'confirmed'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
          >
            Confirmare
          </button>
          <button
            type="button"
            onClick={() => setSelectedStatus('declined')}
            className={`flex-1 rounded-lg py-3 font-medium transition-all
              ${selectedStatus === 'declined'
                ? 'bg-destructive text-destructive-foreground shadow-sm'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
          >
            No podre asistir
          </button>
        </div>

        {selectedStatus && (
          <>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mensaje para la pareja (opcional)"
              maxLength={500}
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-4 py-3
                         text-foreground placeholder:text-muted-foreground resize-none
                         focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={state === 'loading' || !localGuestId}
              className="w-full rounded-lg bg-primary text-primary-foreground py-3
                         font-medium transition-opacity hover:opacity-90
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state === 'loading' ? 'Enviando...' : 'Confirmar respuesta'}
            </button>
          </>
        )}

        {state === 'error' && errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}
      </div>
    </section>
  )
}
