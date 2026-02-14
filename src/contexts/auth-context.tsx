<<<<<<< HEAD
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
=======
import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react'
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
import { apiClient } from '@/api/client'
import type { components } from '@/api/types'

type User = components['schemas']['ProfileResponse']

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('auth_token')
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken) {
        try {
          const response = await apiClient.get<User>('/user/profile')
          setUser(response.data)
          setToken(storedToken)
        } catch (error) {
          localStorage.removeItem('auth_token')
          setToken(null)
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

<<<<<<< HEAD
  const login = async (email: string, password: string) => {
=======
  const login = useCallback(async (email: string, password: string) => {
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
    const response = await apiClient.post<components['schemas']['LoginResponse']>(
      '/auth/login',
      { email, password }
    )
    const newToken = response.data.token
    if (newToken) {
      localStorage.setItem('auth_token', newToken)
      setToken(newToken)

      // Fetch user profile
      const userResponse = await apiClient.get<User>('/user/profile')
      setUser(userResponse.data)
    }
<<<<<<< HEAD
  }

  const register = async (email: string, username: string, password: string) => {
    await apiClient.post('/auth/register', { email, username, password })
  }

  const refreshProfile = async () => {
=======
  }, [])

  const register = useCallback(async (email: string, username: string, password: string) => {
    await apiClient.post('/auth/register', { email, username, password })
  }, [])

  const refreshProfile = useCallback(async () => {
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
    try {
      const response = await apiClient.get<User>('/user/profile')
      setUser(response.data)
    } catch {
      // Silently fail - profile will be refreshed on next page load
    }
<<<<<<< HEAD
  }

  const logout = () => {
=======
  }, [])

  const logout = useCallback(() => {
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
    localStorage.removeItem('auth_token')
    setToken(null)
    setUser(null)
    window.location.href = '/login'
<<<<<<< HEAD
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        refreshProfile,
        isLoading,
      }}
    >
=======
  }, [])

  const value = useMemo(() => ({
    user,
    token,
    login,
    register,
    logout,
    refreshProfile,
    isLoading,
  }), [user, token, login, register, logout, refreshProfile, isLoading])

  return (
    <AuthContext.Provider value={value}>
>>>>>>> d4609d4 (feat: add hooks for managing spaces, users, versions, and webhooks)
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
