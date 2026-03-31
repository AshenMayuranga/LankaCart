import api from '@/lib/axios'
import type { AuthResponse } from '@/types'

export const authApi = {
  login: (body: { username: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', body).then((r) => r.data),

  register: (body: {
    username: string
    email: string
    firstName: string
    lastName: string
    password: string
    phoneNumber?: string
  }) => api.post<AuthResponse>('/auth/register', body).then((r) => r.data),
}