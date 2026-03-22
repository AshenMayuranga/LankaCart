import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '@/api/inventory'
import type { InventoryCreate, InventoryUpdate } from '@/types'
import { toast } from 'sonner'

export const INVENTORY_KEY = ['inventory'] as const

export const useInventory = () =>
  useQuery({ queryKey: INVENTORY_KEY, queryFn: inventoryApi.getAll })

export const useInventoryItem = (id: number) =>
  useQuery({
    queryKey: [...INVENTORY_KEY, id],
    queryFn: () => inventoryApi.getById(id),
    enabled: !!id,
  })

export const useCreateInventory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: InventoryCreate) => inventoryApi.create(body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: INVENTORY_KEY }); toast.success('Inventory item created') },
    onError: (e: Error) => toast.error(e.message),
  })
}

export const useUpdateInventory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: InventoryUpdate }) => inventoryApi.update(id, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: INVENTORY_KEY }); toast.success('Inventory updated') },
    onError: (e: Error) => toast.error(e.message),
  })
}

export const useDeleteInventory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => inventoryApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: INVENTORY_KEY }); toast.success('Inventory item deleted') },
    onError: (e: Error) => toast.error(e.message),
  })
}
