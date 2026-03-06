interface InvitationLocationProps {
  location: string
}

export default function InvitationLocation({ location }: InvitationLocationProps) {
  return (
    <section className="flex flex-col items-center px-6 py-8 text-center space-y-3">
      <h2 className="font-serif text-2xl text-foreground">Ubicacion</h2>
      <p className="text-muted-foreground">{location}</p>
      <a
        href={`https://maps.google.com?q=${encodeURIComponent(location)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-primary hover:underline"
      >
        Ver en Google Maps
      </a>
    </section>
  )
}
