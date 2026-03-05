const TOKEN_KEY = 'lovepostal_token'
const AUTH_COOKIE = 'lovepostal_auth'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  // Cookie con JWT para acceso server-side (server components)
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${secure}`
  // Cookie indicadora para el middleware Edge
  document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${secure}`
}

/** Sincroniza la cookie del JWT si existe en localStorage pero falta la cookie (usuarios pre-deploy). */
export function syncTokenCookie(): void {
  if (typeof window === 'undefined') return
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return
  // Verificar si la cookie ya existe
  if (document.cookie.split(';').some((c) => c.trim().startsWith(`${TOKEN_KEY}=`))) return
  // Escribir la cookie faltante
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${secure}`
}

export function removeToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`
}
