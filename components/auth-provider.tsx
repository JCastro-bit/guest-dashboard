'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { getToken, setToken, removeToken } from '@/lib/auth'
import { login as apiLogin, register as apiRegister, getMe } from '@/lib/api'
import type { AuthUser, LoginRequest, RegisterRequest } from '@/lib/types'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    getMe()
      .then((profile) => {
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role as 'user' | 'admin',
        })
      })
      .catch(() => {
        removeToken()
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const login = useCallback(async (data: LoginRequest) => {
    const response = await apiLogin(data)
    setToken(response.token)
    setUser(response.user)
  }, [])

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await apiRegister(data)
    setToken(response.token)
    setUser(response.user)
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
