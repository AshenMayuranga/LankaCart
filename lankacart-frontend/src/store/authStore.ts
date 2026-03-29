import { create } from 'zustand'
import { authApi } from '@/api/auth'
import type { AuthUser } from '@/types'

const USER_KEY  = 'lankacart_user'
const TOKEN_KEY = 'lankacart_token'

const loadUser = (): AuthUser | null => {
  try { return JSON.parse(localStorage.getItem(USER_KEY) ?? 'null') }
  catch { return null }
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (credentials: { username: string; password: string }) => Promise<void>
  register: (data: {
    username: string; email: string; firstName: string
    lastName: string; password: string; phoneNumber?: string
  }) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: loadUser(),
  isAuthenticated: !!loadUser(),

  login: async (credentials) => {
    const res = await authApi.login(credentials)
    const user: AuthUser = {
      id: res.id,
      username: res.username,
      email: res.email,
      firstName: res.firstName,
      lastName: res.lastName,
      role: res.role,
    }
    localStorage.setItem(TOKEN_KEY, res.token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    set({ user, isAuthenticated: true })
  },

  register: async (data) => {
    const res = await authApi.register(data)
    const user: AuthUser = {
      id: res.id,
      username: res.username,
      email: res.email,
      firstName: res.firstName,
      lastName: res.lastName,
      role: res.role,
    }
    localStorage.setItem(TOKEN_KEY, res.token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    set({ user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
    set({ user: null, isAuthenticated: false })
  },
}))