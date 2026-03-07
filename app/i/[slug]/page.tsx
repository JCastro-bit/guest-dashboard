import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import InvitationHero from '@/components/invitation-public/invitation-hero'
import InvitationLocation from '@/components/invitation-public/invitation-location'
import InvitationRsvpSection from '@/components/invitation-public/invitation-rsvp-section'

interface PublicInvitation {
  slug: string
  coupleName: string
  message: string | null
  eventDate: string | null
  location: string | null
  ownerPlan: string
}

async function getPublicInvitation(slug: string): Promise<PublicInvitation | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${apiUrl}/api/v1/public/invitations/${slug}`, {
    cache: 'no-store',
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Error cargando la invitacion')
  return res.json()
}

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ g?: string }>
}

export default async function PublicInvitationPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { g: guestId } = await searchParams

  const invitation = await getPublicInvitation(slug)
  if (!invitation) notFound()

  return (
    <main className="min-h-screen bg-background">
      <InvitationHero
        coupleName={invitation.coupleName}
        eventDate={invitation.eventDate}
        message={invitation.message}
      />
      {invitation.location && (
        <InvitationLocation location={invitation.location} />
      )}
      <InvitationRsvpSection
        slug={slug}
        guestId={guestId ?? null}
      />
      {invitation.ownerPlan === "free" && (
        <footer className="text-center py-8 text-xs text-muted-foreground font-sans">
          Creado con{" "}
          <a
            href="https://lovepostal.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            LOVEPOSTAL
          </a>
        </footer>
      )}
    </main>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const invitation = await getPublicInvitation(slug)
  return {
    title: invitation
      ? `${invitation.coupleName} — LOVEPOSTAL`
      : 'Invitacion — LOVEPOSTAL',
  }
}
