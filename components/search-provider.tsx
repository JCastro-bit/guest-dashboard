import { getInvitationsWithGuests } from "@/lib/api"
import { SearchCommand } from "./search-command"

export async function SearchProvider() {
  let invitations: Awaited<ReturnType<typeof getInvitationsWithGuests>> = []
  let guests: any[] = []

  try {
    invitations = await getInvitationsWithGuests()
    // Flatten all guests from invitations
    guests = invitations.flatMap((inv) => inv.guests || [])
  } catch (error) {
    console.error("Failed to load data for search:", error)
  }

  return <SearchCommand invitations={invitations} guests={guests} />
}
