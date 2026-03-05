'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { getToken, setToken, removeToken, syncTokenCookie } from '@/lib/auth'
import { login as apiLogin, register as apiRegister, getMe } from '@/lib/api'
import type { AuthUser, LoginRequest, RegisterRequest } from '@/lib/types'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    syncTokenCookie()
    const token = getToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    getMe()
      .then((profile) => {
        const normalizedRole: 'user' | 'admin' =
          profile.role === 'admin' || profile.role === 'user' ? profile.role : 'user'
        if (normalizedRole !== profile.role) {
          console.warn(`Unknown role "${profile.role}" received from API, defaulting to "user"`)
        }
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: normalizedRole,
          plan: profile.plan ?? 'free',
          planStatus: profile.planStatus ?? 'inactive',
        })
      })
      .catch((error) => {
        console.error('Failed to fetch authenticated user during initial load:', error)
        removeToken()
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const login = useCallback(async (data: LoginRequest) => {
    const response = await apiLogin(data)
    setToken(response.token)
    setUser({
      ...response.user,
      plan: response.user.plan ?? 'free',
      planStatus: response.user.planStatus ?? 'inactive',
    })
  }, [])

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await apiRegister(data)
    setToken(response.token)
    setUser({
      ...response.user,
      plan: response.user.plan ?? 'free',
      planStatus: response.user.planStatus ?? 'inactive',
    })
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const profile = await getMe()
      const normalizedRole: 'user' | 'admin' =
        profile.role === 'admin' || profile.role === 'user' ? profile.role : 'user'
      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: normalizedRole,
        plan: profile.plan ?? 'free',
        planStatus: profile.planStatus ?? 'inactive',
      })
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }, [])

  const logout = useCallback(() => {
    removeToken()
    setUser(null)
    window.location.href = '/login'
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
