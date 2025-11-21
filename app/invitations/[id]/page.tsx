import { getInvitation, getGuests } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GuestTable } from "@/components/guest-table"
import { StatusBadge } from "@/components/status-badge"
import { ArrowLeft, Calendar, MapPin, MessageSquare, QrCode, Users } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { notFound } from "next/navigation"
import { getInvitationStatus, getGuestCount } from "@/lib/utils"
import type { Metadata } from "next"
import { InvitationQRCode } from "@/components/invitation-qr-code"

interface InvitationDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: InvitationDetailsPageProps): Promise<Metadata> {
  const { id } = await params

  try {
    const [invitation, guests] = await Promise.all([
      getInvitation(id),
      getGuests(id),
    ])

    const invitationWithGuests = {
      ...invitation,
      guests,
    }

    const guestCount = getGuestCount(invitationWithGuests)
    const eventDate = invitation.eventDate
      ? format(new Date(invitation.eventDate), "MMMM d, yyyy")
      : "Date TBD"

    const description = invitation.eventDate && invitation.location
      ? `Wedding invitation for ${invitation.name}. ${guestCount} guest${guestCount !== 1 ? 's' : ''} invited. Event on ${eventDate} at ${invitation.location}.`
      : `Wedding invitation for ${invitation.name}. ${guestCount} guest${guestCount !== 1 ? 's' : ''} invited.`

    return {
      title: invitation.name,
      description,
      openGraph: {
        title: `${invitation.name} | Guest Dashboard`,
        description,
        url: `/invitations/${id}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${invitation.name} | Guest Dashboard`,
        description,
      },
    }
  } catch (error) {
    return {
      title: "Invitation Not Found",
      description: "The requested invitation could not be found.",
    }
  }
}

export default async function InvitationDetailsPage({ params }: InvitationDetailsPageProps) {
  // In Next.js 16, params is a Promise and must be awaited
  const { id } = await params

  try {
    // Fetch invitation and its guests in parallel
    const [invitation, allGuests] = await Promise.all([
      getInvitation(id),
      getGuests(id),
    ])

    // Enrich invitation with guests
    const invitationWithGuests = {
      ...invitation,
      guests: allGuests,
    }

    const status = getInvitationStatus(invitationWithGuests)
    const guestCount = getGuestCount(invitationWithGuests)

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/invitations">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-serif font-bold tracking-tight">{invitation.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Created on {format(new Date(invitation.createdAt), "MMMM d, yyyy")}
              </p>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invitation Details Card */}
            <Card>
          <CardHeader>
            <CardTitle>Invitation Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Event Date */}
              {invitation.eventDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Event Date</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(invitation.eventDate), "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
              )}

              {/* Location */}
              {invitation.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{invitation.location}</p>
                  </div>
                </div>
              )}

              {/* Table Assignment */}
              {invitation.table && (
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Table Assignment</p>
                    <p className="text-sm text-muted-foreground">{invitation.table.name}</p>
                  </div>
                </div>
              )}

              {/* Guest Count */}
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Total Guests</p>
                  <p className="text-sm text-muted-foreground">
                    {guestCount} {guestCount === 1 ? "guest" : "guests"}
                  </p>
                </div>
              </div>

              {/* QR Code */}
              {invitation.qrCode && (
                <div className="flex items-start gap-3">
                  <QrCode className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">QR Code</p>
                    <p className="text-sm text-muted-foreground">{invitation.qrCode}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message */}
            {invitation.message && (
              <div className="flex items-start gap-3 pt-4 border-t">
                <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">Personal Message</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {invitation.message}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
            </Card>

            {/* Guests Section */}
            <Card>
              <CardHeader>
                <CardTitle>Guests ({guestCount})</CardTitle>
              </CardHeader>
              <CardContent>
                {allGuests.length > 0 ? (
                  <GuestTable guests={allGuests} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No guests added to this invitation yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - QR Code */}
          <div className="lg:col-span-1">
            <InvitationQRCode invitationId={id} invitationName={invitation.name} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Failed to load invitation:", error)
    notFound()
  }
}
