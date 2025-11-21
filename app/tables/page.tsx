import { getTables, getTableStats } from "@/lib/api"
import { CreateTableModal } from "@/components/create-table-modal"
import type { Metadata } from "next"
import { TablesContainer } from "@/components/tables-container"
import { TableStatsCards } from "@/components/table-stats-cards"
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

  try {
    const results = await Promise.allSettled([
      getTables(),
      getTableStats()
    ])

    // Handle tables result
    if (results[0].status === 'fulfilled') {
      tables = results[0].value
    } else {
      console.error('Failed to fetch tables:', results[0].reason)
    }

    // Handle stats result
    if (results[1].status === 'fulfilled') {
      stats = results[1].value
    } else {
      console.error('Failed to fetch table stats:', results[1].reason)
    }
  } catch (error) {
    console.error('Error loading tables page:', error)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-serif font-bold tracking-tight">Tables</h2>
        <CreateTableModal />
      </div>

      <TableStatsCards stats={stats} />

      <TablesContainer tables={tables} />
    </div>
  )
}
