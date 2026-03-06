interface InvitationHeroProps {
  coupleName: string
  eventDate: string | null
  message: string | null
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function getDaysUntil(dateStr: string): number | null {
  const target = new Date(dateStr + 'T12:00:00')
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  if (diff <= 0) return null
  return Math.ceil(diff / 86400000)
}

export default function InvitationHero({ coupleName, eventDate, message }: InvitationHeroProps) {
  const daysUntil = eventDate ? getDaysUntil(eventDate) : null

  return (
    <section className="flex flex-col items-center justify-center px-6 py-16 text-center space-y-6">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">
        Estas invitado a la boda de
      </p>
      <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
        {coupleName}
      </h1>
      {eventDate && (
        <p className="text-lg text-muted-foreground">
          {formatDate(eventDate)}
        </p>
      )}
      {daysUntil !== null && (
        <p className="text-sm text-primary font-medium">
          Faltan {daysUntil} {daysUntil === 1 ? 'dia' : 'dias'}
        </p>
      )}
      {message && (
        <p className="max-w-md text-muted-foreground leading-relaxed">
          {message}
        </p>
      )}
    </section>
  )
}
