export const dynamic = 'force-dynamic'

import { getTables, getTableStats } from "@/lib/api"
import { CreateTableModal } from "@/components/create-table-modal"
import { PlanGate } from "@/components/plan-gate"
import type { Metadata } from "next"
import { TablesContainer } from "@/components/tables-container"
import { TableStatsCards } from "@/components/table-stats-cards"
import { ErrorAlert } from "@/components/error-alert"
import type { Table } from "@/lib/types"

export const metadata: Metadata = {
  title: "Tables",
  description: "Manage wedding reception tables. Organize seating arrangements and track table assignments for your guests.",
  openGraph: {
    title: "Tables | Guest Dashboard",
    description: "Manage wedding reception tables. Organize seating arrangements and track table assignments for your guests.",
    url: "/tables",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tables | Guest Dashboard",
    description: "Manage wedding reception tables. Organize seating arrangements and track table assignments for your guests.",
  },
}

export default async function TablesPage() {
  let tables: Table[] = []
  let stats = null
  let hasError = false

  try {
    const results = await Promise.allSettled([
      getTables(),
      getTableStats()
    ])

    if (results[0].status === 'fulfilled') {
      tables = results[0].value
    } else {
      console.error('Failed to fetch tables:', results[0].reason)
      hasError = true
    }

    if (results[1].status === 'fulfilled') {
      stats = results[1].value
    } else {
      console.error('Failed to fetch table stats:', results[1].reason)
      hasError = true
    }
  } catch (error) {
    console.error('Error loading tables page:', error)
    hasError = true
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-serif font-bold tracking-tight">Tables</h2>
        <PlanGate>
          <CreateTableModal />
        </PlanGate>
      </div>

      {hasError && <ErrorAlert />}

      <TableStatsCards stats={stats} />

      <TablesContainer tables={tables} />
    </div>
  )
}
