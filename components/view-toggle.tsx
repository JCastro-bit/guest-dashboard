"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LayoutGrid, TableIcon } from "lucide-react"

interface ViewToggleProps {
  view: "grid" | "table"
  onViewChange: (view: "grid" | "table") => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border bg-background p-1">
      <Button
        variant={view === "grid" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("grid")}
        className="gap-2"
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Grid</span>
      </Button>
      <Button
        variant={view === "table" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("table")}
        className="gap-2"
      >
        <TableIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Table</span>
      </Button>
    </div>
  )
}
