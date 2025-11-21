"use client"

import type { Table } from "@/lib/types"
import { TableCard } from "@/components/table-card"

interface TablesGridProps {
  tables: Table[]
}

export function TablesGrid({ tables }: TablesGridProps) {
  if (tables.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No tables found. Create your first table to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tables.map((table) => (
        <TableCard key={table.id} table={table} />
      ))}
    </div>
  )
}
