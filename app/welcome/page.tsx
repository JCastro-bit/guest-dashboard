import { Metadata } from 'next'
import Link from 'next/link'
import {
  Heart,
  QrCode,
  Users,
  CalendarCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'LOVEPOSTAL — Invitaciones digitales para tu boda',
  description:
    'Crea invitaciones digitales elegantes, recibe confirmaciones en tiempo real y organiza tu boda sin estrés.',
  openGraph: {
    title: 'LOVEPOSTAL — Invitaciones digitales para tu boda',
    description:
      'Crea invitaciones digitales elegantes, recibe confirmaciones en tiempo real y organiza tu boda sin estrés.',
    url: '/welcome',
    images: [
      {
        url: 'https://cdn.lovepostal.studio/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LOVEPOSTAL — Invitaciones digitales para tu boda',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LOVEPOSTAL — Invitaciones digitales para tu boda',
    description:
      'Crea invitaciones digitales elegantes, recibe confirmaciones en tiempo real y organiza tu boda sin estrés.',
    images: ['https://cdn.lovepostal.studio/og-image.jpg'],
  },
}

const features = [
  {
    icon: Heart,
    title: 'Invitaciones elegantes',
    description: 'Comparte tu invitación con un link único y personalizado para cada pareja.',
  },
  {
    icon: CalendarCheck,
    title: 'Confirmaciones en tiempo real',
    description: 'Recibe RSVPs al instante. Sin llamadas, sin WhatsApps, sin hojas de cálculo.',
  },
  {
    icon: Users,
    title: 'Organiza mesas e invitados',
    description: 'Asigna invitados a mesas, controla capacidad y visualiza todo desde un panel.',
  },
  {
    icon: QrCode,
    title: 'Códigos QR',
    description: 'Genera QR únicos para cada invitación. Perfecto para invitaciones impresas.',
  },
]

const benefits = [
  'Crea tu cuenta gratis en 30 segundos',
  'Diseña tu invitación con nombre y fecha',
  'Agrega invitados y envía el link',
  'Recibe confirmaciones automáticamente',
]

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://cdn.lovepostal.studio/logotipos/logo_lovepostal_4.webp"
          alt="LOVEPOSTAL"
          width={160}
          height={40}
          className="h-7 w-auto"
        />
        <Link
          href="/login"
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          Iniciar sesión
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="size-3.5" />
                Nuevo: Confirmaciones con un click
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight tracking-wide">
                Tu boda,{' '}
                <span className="text-primary">organizada</span>{' '}
                sin estrés
              </h1>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md">
                Invitaciones digitales elegantes, confirmaciones automáticas y
                un panel para gestionar todo tu evento en un solo lugar.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary
                             text-primary-foreground px-6 py-3 font-medium transition-opacity
                             hover:opacity-90"
                >
                  Comenzar gratis
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="https://lovepostal.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border
                             border-border bg-background text-foreground px-6 py-3 font-medium
                             transition-colors hover:bg-secondary"
                >
                  Conoce más
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop"
                  alt="Pareja en su boda"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 rounded-xl bg-card border border-border shadow-lg p-4 max-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="size-4 text-success" />
                  <span className="text-xs font-medium text-foreground">RSVP confirmado</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  María y Carlos confirmaron asistencia
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-card border-y border-border">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
              Todo lo que necesitas para tu boda
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Desde la invitación hasta la organización de mesas, todo en una plataforma diseñada para parejas.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="space-y-3 p-4">
                <div className="inline-flex items-center justify-center size-10 rounded-lg bg-primary/10">
                  <feature.icon className="size-5 text-primary" />
                </div>
                <h3 className="font-medium text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
              Listo en minutos
            </h2>
            <p className="text-muted-foreground mb-8">
              Sin complicaciones. Crea tu cuenta, personaliza tu invitación y compártela con tus invitados.
            </p>
            <ol className="space-y-4">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 inline-flex items-center justify-center size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground pt-0.5">{benefit}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative hidden md:block">
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop"
                alt="Detalles de boda"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 border-y border-border">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
            Empieza a organizar tu boda hoy
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Crea tu cuenta gratis y descubre lo fácil que es gestionar tus invitados y confirmaciones.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary
                       text-primary-foreground px-8 py-3.5 font-medium transition-opacity
                       hover:opacity-90 text-base"
          >
            Crear mi cuenta gratis
            <ArrowRight className="size-4" />
          </Link>
          <p className="text-xs text-muted-foreground mt-4">
            Sin tarjeta de crédito · Gratis para empezar
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://cdn.lovepostal.studio/isotipos/isotipo_lovepostal_8.webp"
          alt="LOVEPOSTAL"
          width={28}
          height={28}
          className="size-7 opacity-60"
        />
        <p>© {new Date().getFullYear()} LOVEPOSTAL. Hecho con amor en Guadalajara.</p>
        <a
          href="https://lovepostal.studio"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          lovepostal.studio
        </a>
      </footer>
    </main>
  )
}
