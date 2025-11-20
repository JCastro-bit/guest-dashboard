"use client"

import { useState } from "react"
import type { Invitation } from "@/lib/types"
import { InvitationCard } from "@/components/invitation-card"
import { InvitationsTable } from "@/components/invitations-table"
import { Button } from "@/components/ui/button"
import { LayoutGrid, TableIcon } from "lucide-react"

interface InvitationsViewProps {
  invitations: Invitation[]
}

export function InvitationsView({ invitations }: InvitationsViewProps) {
  const [view, setView] = useState<"grid" | "table">("grid")

  if (invitations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No invitations found. Create your first invitation to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex items-center justify-end">
        <div className="inline-flex rounded-lg border bg-background p-1">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("grid")}
            className="gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Grid</span>
          </Button>
          <Button
            variant={view === "table" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("table")}
            className="gap-2"
          >
            <TableIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Table</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {invitations.map((invitation) => (
            <InvitationCard key={invitation.id} invitation={invitation} />
          ))}
        </div>
      ) : (
        <InvitationsTable invitations={invitations} />
      )}
    </div>
  )
}
