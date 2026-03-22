import api from '@/lib/axios'
import type { User, UserCreate, UserUpdate } from '@/types'

export const usersApi = {
  getAll:  ()                            => api.get<User[]>('/users').then((r) => r.data),
  getById: (id: number)                  => api.get<User>(`/users/${id}`).then((r) => r.data),
  create:  (body: UserCreate)            => api.post<User>('/users', body).then((r) => r.data),
  update:  (id: number, body: UserUpdate) => api.put<User>(`/users/${id}`, body).then((r) => r.data),
  delete:  (id: number)                  => api.delete(`/users/${id}`).then((r) => r.data),
}
