export type RSVPStatus = "confirmed" | "declined" | "pending"

export type Side = "bride" | "groom" | "mutual"

export interface Guest {
  id: string
  invitationId: string
  name: string
  email?: string
  phone?: string
  side: Side
  status: RSVPStatus
  dietaryRestrictions?: string
  isPlusOne: boolean
}

export interface Invitation {
  id: string
  name: string // e.g., "The Smith Family"
  guests: Guest[]
  status: RSVPStatus // Derived from guests (if all declined -> declined, if any confirmed -> confirmed, else pending)
  sentAt?: string
  viewedAt?: string
  tableNumber?: number
  maxGuests: number
}

export interface DashboardStats {
  totalGuests: number
  confirmedGuests: number
  declinedGuests: number
  pendingGuests: number
  totalInvitations: number
  confirmedInvitations: number
  pendingInvitations: number
  declinedInvitations: number
}
