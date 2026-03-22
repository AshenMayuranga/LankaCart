import api from '@/lib/axios'
import type { Product, ProductCreate, ProductUpdate } from '@/types'

export const productsApi = {
  getAll:  ()                              => api.get<Product[]>('/products').then((r) => r.data),
  getById: (id: number)                    => api.get<Product>(`/products/${id}`).then((r) => r.data),
  create:  (body: ProductCreate)           => api.post<Product>('/products', body).then((r) => r.data),
  update:  (id: number, body: ProductUpdate) => api.put<Product>(`/products/${id}`, body).then((r) => r.data),
  delete:  (id: number)                    => api.delete(`/products/${id}`).then((r) => r.data),
}
