import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LOVEPOSTAL — Invitaciones digitales para tu boda',
}

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="font-serif text-4xl text-foreground tracking-wide">
            LOVEPOSTAL
          </h1>
          <p className="text-muted-foreground">
            Invitaciones digitales para tu boda
          </p>
        </div>

        <ul className="text-left space-y-2 text-sm text-muted-foreground">
          <li>Comparte tu invitacion con un link</li>
          <li>Recibe confirmaciones en tiempo real</li>
          <li>Organiza mesas y gestiona invitados</li>
        </ul>

        <div className="space-y-3">
          <a
            href="/register"
            className="block w-full rounded-lg bg-primary text-primary-foreground
                       py-3 text-center font-medium transition-opacity hover:opacity-90"
          >
            Crear mi cuenta gratis
          </a>
          <p className="text-sm text-muted-foreground">
            Ya tienes cuenta?{' '}
            <a href="/login" className="text-primary hover:underline">
              Iniciar sesion
            </a>
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          <a
            href="https://lovepostal.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Conoce mas en lovepostal.studio
          </a>
        </p>
      </div>
    </main>
  )
}
