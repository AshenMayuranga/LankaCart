import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '@/api/orders'
import type { OrderCreate, OrderUpdate } from '@/types'
import { toast } from 'sonner'

export const ORDERS_KEY = ['orders'] as const

export const useOrders = () =>
  useQuery({ queryKey: ORDERS_KEY, queryFn: ordersApi.getAll })

export const useOrder = (id: number) =>
  useQuery({
    queryKey: [...ORDERS_KEY, id],
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  })

export const useCreateOrder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: OrderCreate) => ordersApi.create(body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ORDERS_KEY }) },
    onError: (e: Error) => toast.error(e.message),
  })
}

export const useUpdateOrder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: OrderUpdate }) => ordersApi.update(id, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ORDERS_KEY }); toast.success('Order updated') },
    onError: (e: Error) => toast.error(e.message),
  })
}

export const useDeleteOrder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => ordersApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ORDERS_KEY }); toast.success('Order deleted') },
    onError: (e: Error) => toast.error(e.message),
  })
}
