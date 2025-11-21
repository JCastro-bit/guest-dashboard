"use client"

import { useState } from "react"
import type { Table } from "@/lib/types"
import { SearchButton } from "@/components/search-button"
import { TablesGrid } from "@/components/tables-grid"
import { TablesTable } from "@/components/tables-table"
import { ViewToggle } from "@/components/view-toggle"

interface TablesContainerProps {
  tables: Table[]
}

export function TablesContainer({ tables }: TablesContainerProps) {
  const [view, setView] = useState<"grid" | "table">("grid")

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
        <SearchButton variant="prominent" className="w-full sm:max-w-md" />
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <ViewToggle view={view} onViewChange={setView} />
        </div>
      </div>

      {view === "grid" ? (
        <TablesGrid tables={tables} />
      ) : (
        <TablesTable tables={tables} />
      )}
    </>
  )
}
