"use client"

import type { Invitation } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { Users, Mail } from "lucide-react"
import { format } from "date-fns"

interface InvitationCardProps {
  invitation: Invitation
  onView?: (invitation: Invitation) => void
}

export function InvitationCard({ invitation, onView }: InvitationCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="font-semibold leading-none tracking-tight">{invitation.name}</h3>
          <p className="text-sm text-muted-foreground">
            {invitation.guests.length} {invitation.guests.length === 1 ? "guest" : "guests"}
          </p>
        </div>
        <StatusBadge status={invitation.status} />
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          {invitation.sentAt && (
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              <span>Sent {format(new Date(invitation.sentAt), "MMM d, yyyy")}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5" />
            <span>Max {invitation.maxGuests} guests allowed</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full bg-transparent" onClick={() => onView?.(invitation)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
