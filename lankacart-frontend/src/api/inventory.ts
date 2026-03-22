import api from '@/lib/axios'
import type { Inventory, InventoryCreate, InventoryUpdate } from '@/types'

export const inventoryApi = {
  getAll:  ()                                  => api.get<Inventory[]>('/inventory').then((r) => r.data),
  getById: (id: number)                        => api.get<Inventory>(`/inventory/${id}`).then((r) => r.data),
  create:  (body: InventoryCreate)             => api.post<Inventory>('/inventory', body).then((r) => r.data),
  update:  (id: number, body: InventoryUpdate) => api.put<Inventory>(`/inventory/${id}`, body).then((r) => r.data),
  delete:  (id: number)                        => api.delete(`/inventory/${id}`).then((r) => r.data),
}
