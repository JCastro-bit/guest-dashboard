export type RSVPStatus = "confirmed" | "declined" | "pending"

export type Side = "bride" | "groom"

export interface Guest {
  id: string
  name: string
  side: Side
  phone: string | null
  email: string | null
  status: RSVPStatus
  invitationId: string | null
  operationId: string | null
  createdAt: string
  invitation?: Invitation | null
}

export interface Invitation {
  id: string
  name: string
  tableNumber: string | null
  message: string | null
  eventDate: string | null
  location: string | null
  qrCode: string | null
  operationId: string | null
  createdAt: string
  guests?: Guest[]
}

export interface DashboardStats {
  totalGuests: number
  confirmed: number
  pending: number
  declined: number
  totalInvitations: number
  daysUntilWedding: number
  // Calculated fields for backward compatibility
  confirmedGuests?: number
  declinedGuests?: number
  pendingGuests?: number
  confirmedInvitations?: number
  pendingInvitations?: number
  declinedInvitations?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface CreateInvitationRequest {
  name: string
  tableNumber?: string | null
  message?: string | null
  eventDate?: string | null
  location?: string | null
  qrCode?: string | null
  operationId?: string | null
}

export interface CreateInvitationWithGuestsRequest {
  invitation: CreateInvitationRequest
  guests: {
    name: string
    side: Side
    phone?: string | null
    email?: string | null
    status?: RSVPStatus
    operationId?: string | null
  }[]
}

export interface CreateGuestRequest {
  name: string
  side: Side
  phone?: string | null
  email?: string | null
  status?: RSVPStatus
  invitationId?: string | null
  operationId?: string | null
}
