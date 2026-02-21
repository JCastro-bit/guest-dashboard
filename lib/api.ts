import { getToken, removeToken } from "./auth"
import type {
  Invitation,
  Guest,
  DashboardStats,
  PaginatedResponse,
  CreateInvitationRequest,
  CreateInvitationWithGuestsRequest,
  CreateGuestRequest,
  Table,
  GlobalTableStats,
  CreateTableRequest,
  UpdateTableRequest,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserProfile,
} from "./types"

// Get API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Prevents multiple simultaneous 401-triggered redirects.
// Resets automatically on page navigation since it's module-level.
let isRedirectingToLogin = false

// Helper function to handle API requests
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options?.headers as Record<string, string>) || {}),
  }

  // Inyectar token si existe (solo en cliente)
  const token = getToken()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const defaultOptions: RequestInit = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(url, defaultOptions)

    if (!response.ok) {
      // 401 global: limpiar token y redirigir a login (evitar bucles en rutas de auth)
      if (response.status === 401) {
        removeToken()
        if (typeof window !== 'undefined') {
          const { pathname } = window.location
          const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')
          if (!isAuthRoute && !isRedirectingToLogin) {
            isRedirectingToLogin = true
            window.location.href = '/login'
            throw new Error('Unauthorized - redirecting to login')
          }
        }
      }

      const errorData = await response.json().catch(() => null)
      const message = errorData?.error?.message || errorData?.message || `API Error (${response.status})`
      throw new Error(message)
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return undefined as T
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error && error.message.includes('API Error')) {
      throw error
    }
    console.error(`API request failed: ${url}`, error)
    throw error
  }
}

// ==================== Invitations API ====================

export async function getInvitations(
  page?: number,
  limit?: number
): Promise<Invitation[]> {
  const params = new URLSearchParams()
  if (page) params.append("page", page.toString())
  if (limit) params.append("limit", limit.toString())

  const query = params.toString() ? `?${params.toString()}` : ""
  const result = await fetchAPI<Invitation[] | PaginatedResponse<Invitation>>(
    `/api/v1/invitations/${query}`
  )

  // Handle both array and paginated response formats
  return Array.isArray(result) ? result : result.data
}

/**
 * Get all invitations enriched with their guests.
 * Since the GET /api/v1/invitations/ endpoint doesn't include guests,
 * this function fetches guests separately and enriches the invitations.
 */
export async function getInvitationsWithGuests(
  page?: number,
  limit?: number
): Promise<Invitation[]> {
  // Fetch invitations and all guests in parallel
  const [invitations, allGuests] = await Promise.all([
    getInvitations(page, limit),
    getGuests(), // Get all guests
  ])

  // Group guests by invitationId
  const guestsByInvitation = allGuests.reduce((acc, guest) => {
    if (guest.invitationId) {
      if (!acc[guest.invitationId]) {
        acc[guest.invitationId] = []
      }
      acc[guest.invitationId].push(guest)
    }
    return acc
  }, {} as Record<string, Guest[]>)

  // Enrich invitations with their guests
  return invitations.map((invitation) => ({
    ...invitation,
    guests: guestsByInvitation[invitation.id] || [],
  }))
}

export async function getInvitation(id: string): Promise<Invitation> {
  return fetchAPI<Invitation>(`/api/v1/invitations/${id}`)
}

export async function createInvitation(
  data: CreateInvitationRequest
): Promise<Invitation> {
  return fetchAPI<Invitation>("/api/v1/invitations/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function createInvitationWithGuests(
  data: CreateInvitationWithGuestsRequest
): Promise<Invitation> {
  return fetchAPI<Invitation>("/api/v1/invitations/with-guests", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateInvitation(
  id: string,
  data: Partial<CreateInvitationRequest>
): Promise<Invitation> {
  return fetchAPI<Invitation>(`/api/v1/invitations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteInvitation(id: string): Promise<void> {
  return fetchAPI<void>(`/api/v1/invitations/${id}`, {
    method: "DELETE",
  })
}

// ==================== Guests API ====================

export async function getGuests(
  invitationId?: string,
  page?: number,
  limit?: number
): Promise<Guest[]> {
  const params = new URLSearchParams()
  if (invitationId) params.append("invitationId", invitationId)
  if (page) params.append("page", page.toString())
  if (limit) params.append("limit", limit.toString())

  const query = params.toString() ? `?${params.toString()}` : ""
  const result = await fetchAPI<Guest[] | PaginatedResponse<Guest>>(
    `/api/v1/guests/${query}`
  )

  // Handle both array and paginated response formats
  return Array.isArray(result) ? result : result.data
}

export async function getGuest(id: string): Promise<Guest> {
  return fetchAPI<Guest>(`/api/v1/guests/${id}`)
}

export async function createGuest(data: CreateGuestRequest): Promise<Guest> {
  return fetchAPI<Guest>("/api/v1/guests/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateGuest(
  id: string,
  data: Partial<CreateGuestRequest>
): Promise<Guest> {
  return fetchAPI<Guest>(`/api/v1/guests/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteGuest(id: string): Promise<void> {
  return fetchAPI<void>(`/api/v1/guests/${id}`, {
    method: "DELETE",
  })
}

// ==================== Stats API ====================

export async function getStats(): Promise<DashboardStats> {
  const stats = await fetchAPI<DashboardStats>("/api/v1/stats/dashboard")

  // Add backward compatibility fields
  return {
    ...stats,
    confirmedGuests: stats.confirmed,
    declinedGuests: stats.declined,
    pendingGuests: stats.pending,
  }
}

// ==================== Tables API ====================

export async function getTables(): Promise<Table[]> {
  return fetchAPI<Table[]>("/api/v1/tables")
}

export async function getTable(id: string): Promise<Table> {
  return fetchAPI<Table>(`/api/v1/tables/${id}`)
}

export async function createTable(data: CreateTableRequest): Promise<Table> {
  return fetchAPI<Table>("/api/v1/tables", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateTable(
  id: string,
  data: UpdateTableRequest
): Promise<Table> {
  return fetchAPI<Table>(`/api/v1/tables/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteTable(id: string): Promise<void> {
  return fetchAPI<void>(`/api/v1/tables/${id}`, {
    method: "DELETE",
  })
}

export async function getTableStats(): Promise<GlobalTableStats> {
  const result = await fetchAPI<GlobalTableStats>("/api/v1/stats/tables")
  return result
}

// ==================== Auth API ====================

export async function login(data: LoginRequest): Promise<AuthResponse> {
  return fetchAPI<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  return fetchAPI<AuthResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getMe(): Promise<UserProfile> {
  return fetchAPI<UserProfile>("/api/v1/auth/me")
}

// ==================== Health Check ====================

export async function healthCheck(): Promise<boolean> {
  try {
    await fetchAPI<void>("/health")
    return true
  } catch {
    return false
  }
}
