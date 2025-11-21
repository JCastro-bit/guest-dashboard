"use client"

import { useState, useMemo } from "react"
import type { Invitation } from "@/lib/types"
import { SearchButton } from "@/components/search-button"
import { ViewToggle } from "@/components/view-toggle"
import { InvitationsView } from "@/components/invitations-view"
import { StatusFilterComponent, type StatusFilter } from "@/components/status-filter"
import { getInvitationStatus } from "@/lib/utils"

interface InvitationsContainerProps {
  invitations: Invitation[]
}

export function InvitationsContainer({ invitations }: InvitationsContainerProps) {
  const [view, setView] = useState<"grid" | "table">("grid")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  // Filter invitations based on status
  const filteredInvitations = useMemo(() => {
    if (statusFilter === "all") {
      return invitations
    }

    return invitations.filter((invitation) => {
      const status = getInvitationStatus(invitation)
      return status === statusFilter
    })
  }, [invitations, statusFilter])

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
        <SearchButton variant="prominent" className="w-full sm:max-w-md" />
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <StatusFilterComponent status={statusFilter} onStatusChange={setStatusFilter} />
          <ViewToggle view={view} onViewChange={setView} />
        </div>
      </div>

      <InvitationsView invitations={filteredInvitations} view={view} />
    </>
  )
}
