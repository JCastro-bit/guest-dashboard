"use client"

import { useState } from "react"
import type { Invitation } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { SearchButton } from "@/components/search-button"
import { ViewToggle } from "@/components/view-toggle"
import { InvitationsView } from "@/components/invitations-view"

interface InvitationsContainerProps {
  invitations: Invitation[]
}

export function InvitationsContainer({ invitations }: InvitationsContainerProps) {
  const [view, setView] = useState<"grid" | "table">("grid")

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
        <SearchButton variant="prominent" className="w-full sm:max-w-md" />
        <div className="flex gap-2 w-full sm:w-auto">
          <ViewToggle view={view} onViewChange={setView} />
          <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <InvitationsView invitations={invitations} view={view} />
    </>
  )
}
