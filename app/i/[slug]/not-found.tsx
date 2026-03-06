export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <h1 className="font-serif text-3xl text-foreground">
          Invitacion no encontrada
        </h1>
        <p className="text-muted-foreground">
          El link que usaste no es valido o la invitacion ya no esta disponible.
        </p>
      </div>
    </main>
  )
}
