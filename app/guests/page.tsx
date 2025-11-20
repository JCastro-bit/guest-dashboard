import { getInvitationsWithGuests } from "@/lib/api"
import { GuestTable } from "@/components/guest-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download } from "lucide-react"

export default async function GuestsPage() {
  const invitations = await getInvitationsWithGuests()
  // Flatten invitations to get all guests
  const guests = invitations.flatMap((inv) => inv.guests || [])

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-serif font-bold tracking-tight">Guest List</h2>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search guests..." className="pl-8" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <GuestTable guests={guests} />
    </div>
  )
}
