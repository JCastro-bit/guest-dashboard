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
  tableId: string | null
  message: string | null
  eventDate: string | null
  location: string | null
  qrCode: string | null
  operationId: string | null
  createdAt: string
  guests?: Guest[]
  table?: Table | null
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

// Table types
export interface Table {
  id: string
  name: string
  capacity: number
  location: string | null
  notes: string | null
  createdAt: string
  invitations?: Invitation[]
  // Stats fields (from list endpoint)
  guestCount?: number
  available?: number
  invitationsCount?: number
}

export interface TableStats {
  id: string
  name: string
  capacity: number
  guestCount: number
  available: number
  invitationsCount: number
}

export interface GlobalTableStats {
  tables: TableStats[]
  summary: {
    totalTables: number
    totalCapacity: number
    totalGuests: number
    totalAvailable: number
    unassignedGuests: number
  }
}

export interface CreateTableRequest {
  name: string
  capacity?: number
  location?: string | null
  notes?: string | null
}

export interface UpdateTableRequest {
  name?: string
  capacity?: number
  location?: string | null
  notes?: string | null
}
