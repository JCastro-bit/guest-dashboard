const TOKEN_KEY = 'lovepostal_token'
const AUTH_COOKIE = 'lovepostal_auth'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
  // Cookie indicadora para el middleware (NO contiene el JWT real)
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${secure}`
}

export function removeToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`
}
