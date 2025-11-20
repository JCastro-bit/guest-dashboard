import type { Invitation, DashboardStats } from "./types"

// Mock Data
const MOCK_INVITATIONS: Invitation[] = [
  {
    id: "1",
    name: "The Smith Family",
    status: "confirmed",
    maxGuests: 4,
    sentAt: "2023-10-01T10:00:00Z",
    viewedAt: "2023-10-02T15:30:00Z",
    guests: [
      {
        id: "g1",
        invitationId: "1",
        name: "John Smith",
        email: "john@example.com",
        side: "groom",
        status: "confirmed",
        isPlusOne: false,
      },
      {
        id: "g2",
        invitationId: "1",
        name: "Jane Smith",
        email: "jane@example.com",
        side: "groom",
        status: "confirmed",
        isPlusOne: false,
      },
    ],
  },
  {
    id: "2",
    name: "Alice Johnson",
    status: "pending",
    maxGuests: 1,
    sentAt: "2023-10-05T09:00:00Z",
    guests: [
      {
        id: "g3",
        invitationId: "2",
        name: "Alice Johnson",
        side: "bride",
        status: "pending",
        isPlusOne: false,
      },
    ],
  },
  {
    id: "3",
    name: "Bob & Carol",
    status: "declined",
    maxGuests: 2,
    sentAt: "2023-10-01T11:00:00Z",
    viewedAt: "2023-10-03T14:00:00Z",
    guests: [
      {
        id: "g4",
        invitationId: "3",
        name: "Bob Williams",
        side: "mutual",
        status: "declined",
        isPlusOne: false,
      },
      {
        id: "g5",
        invitationId: "3",
        name: "Carol Williams",
        side: "mutual",
        status: "declined",
        isPlusOne: false,
      },
    ],
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getInvitations(): Promise<Invitation[]> {
  await delay(500)
  return [...MOCK_INVITATIONS]
}

export async function getInvitation(id: string): Promise<Invitation | undefined> {
  await delay(300)
  return MOCK_INVITATIONS.find((inv) => inv.id === id)
}

export async function getStats(): Promise<DashboardStats> {
  await delay(500)
  const allGuests = MOCK_INVITATIONS.flatMap((inv) => inv.guests)

  return {
    totalGuests: allGuests.length,
    confirmedGuests: allGuests.filter((g) => g.status === "confirmed").length,
    declinedGuests: allGuests.filter((g) => g.status === "declined").length,
    pendingGuests: allGuests.filter((g) => g.status === "pending").length,
    totalInvitations: MOCK_INVITATIONS.length,
    confirmedInvitations: MOCK_INVITATIONS.filter((i) => i.status === "confirmed").length,
    pendingInvitations: MOCK_INVITATIONS.filter((i) => i.status === "pending").length,
    declinedInvitations: MOCK_INVITATIONS.filter((i) => i.status === "declined").length,
  }
}
