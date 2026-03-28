import { create } from 'zustand'
import { usersApi } from '@/api/users'
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

  login: async ({ username, password }) => {
    if (!username.trim() || !password.trim()) {
      throw new Error('Username and password are required')
    }
    // Try to find real user in the backend database
    let realId = Date.now()
    let email = `${username}@lankacart.lk`
    let firstName = username.charAt(0).toUpperCase() + username.slice(1)
    let lastName = 'User'
    try {
      const users = await usersApi.getAll()
      const found = users.find((u) => u.username.toLowerCase() === username.toLowerCase())
      if (found) {
        realId    = found.id
        email     = found.email
        firstName = found.firstName
        lastName  = found.lastName
      }
    } catch {
      // backend not available — fall back to mock values
    }
    const user: AuthUser = {
      id: realId,
      username,
      email,
      firstName,
      lastName,
      role: username.toLowerCase() === 'admin' ? 'admin' : 'customer',
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    localStorage.setItem(TOKEN_KEY, btoa(`${username}:${password}`))
    set({ user, isAuthenticated: true })
  },

  register: async (data) => {
    // Save to backend database
    const saved = await usersApi.create({
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      phoneNumber: data.phoneNumber,
    })
    const user: AuthUser = {
      id: saved.id,
      username: saved.username,
      email: saved.email,
      firstName: saved.firstName,
      lastName: saved.lastName,
      role: 'customer',
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    localStorage.setItem(TOKEN_KEY, btoa(`${data.username}:${data.password}`))
    set({ user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
    set({ user: null, isAuthenticated: false })
  },
}))
