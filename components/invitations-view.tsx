"use client"

import type { Invitation } from "@/lib/types"
import { InvitationCard } from "@/components/invitation-card"
import { InvitationsTable } from "@/components/invitations-table"

interface InvitationsViewProps {
  invitations: Invitation[]
  view: "grid" | "table"
}

export function InvitationsView({ invitations, view }: InvitationsViewProps) {
  if (invitations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No invitations found. Create your first invitation to get started!</p>
      </div>
    )
  }

  return (
    <>
      {view === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {invitations.map((invitation) => (
            <InvitationCard key={invitation.id} invitation={invitation} />
          ))}
        </div>
      ) : (
        <InvitationsTable invitations={invitations} />
      )}
    </>
  )
}
