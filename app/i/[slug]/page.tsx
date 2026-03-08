import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getTemplate } from '@/lib/templates'
import InvitationPreview from '@/components/invitation-preview'
import InvitationRsvpSection from '@/components/invitation-public/invitation-rsvp-section'

interface PublicGuest {
  id: string
  name: string
  status: string
}

interface PublicInvitation {
  slug: string
  coupleName: string
  message: string | null
  eventDate: string | null
  location: string | null
  templateId: string | null
  colorPalette: string | null
  ownerPlan: string
  tableName: string | null
  guests: PublicGuest[]
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
}

export default async function PublicInvitationPage({ params }: PageProps) {
  const { slug } = await params

  const invitation = await getPublicInvitation(slug)
  if (!invitation) notFound()

  const template = getTemplate(invitation.templateId)

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: template.colors.background }}
    >
      <InvitationPreview
        template={template}
        coupleName={invitation.coupleName}
        eventDate={invitation.eventDate}
        venue={invitation.location}
        message={invitation.message ?? ''}
      />
      {invitation.tableName && (
        <section
          className="flex flex-col items-center px-6 py-6 text-center"
          style={{ backgroundColor: template.colors.background, color: template.colors.text }}
        >
          <p className="text-sm opacity-70">
            Tu mesa: <span className="font-medium opacity-100">{invitation.tableName}</span>
          </p>
        </section>
      )}
      <div style={{ backgroundColor: template.colors.background }}>
        <InvitationRsvpSection
          slug={slug}
          guests={invitation.guests}
        />
      </div>
      {invitation.ownerPlan === "free" && (
        <footer
          className="text-center py-8 text-xs font-sans opacity-60"
          style={{ backgroundColor: template.colors.background, color: template.colors.text }}
        >
          Creado con <span style={{ color: template.colors.accent }} aria-label="amor">&#9829;</span> en{" "}
          <a
            href="https://lovepostal.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80 transition-opacity"
          >
            LOVEPOSTAL
          </a>
          {" · "}
          <a
            href="https://lovepostal.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80 transition-opacity"
          >
            lovepostal.studio
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
