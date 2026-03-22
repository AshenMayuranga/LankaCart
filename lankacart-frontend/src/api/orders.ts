import api from '@/lib/axios'
import type { Order, OrderCreate, OrderUpdate } from '@/types'

export const ordersApi = {
  getAll:  ()                              => api.get<Order[]>('/orders').then((r) => r.data),
  getById: (id: number)                    => api.get<Order>(`/orders/${id}`).then((r) => r.data),
  create:  (body: OrderCreate)             => api.post<Order>('/orders', body).then((r) => r.data),
  update:  (id: number, body: OrderUpdate) => api.put<Order>(`/orders/${id}`, body).then((r) => r.data),
  delete:  (id: number)                    => api.delete(`/orders/${id}`).then((r) => r.data),
}
