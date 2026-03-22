import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '@/api/products'
import type { ProductCreate, ProductUpdate } from '@/types'
import { toast } from 'sonner'

export const PRODUCTS_KEY = ['products'] as const

export const useProducts = () =>
  useQuery({ queryKey: PRODUCTS_KEY, queryFn: productsApi.getAll })

export const useProduct = (id: number) =>
  useQuery({
    queryKey: [...PRODUCTS_KEY, id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  })

export const useCreateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: ProductCreate) => productsApi.create(body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: PRODUCTS_KEY }); toast.success('Product created successfully') },
    onError: (e: Error) => toast.error(e.message),
  })
}

export const useUpdateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: ProductUpdate }) => productsApi.update(id, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: PRODUCTS_KEY }); toast.success('Product updated successfully') },
    onError: (e: Error) => toast.error(e.message),
  })
}

export const useDeleteProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: PRODUCTS_KEY }); toast.success('Product deleted') },
    onError: (e: Error) => toast.error(e.message),
  })
}
