import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/api/users'
import type { UserCreate, UserUpdate } from '@/types'
import { toast } from 'sonner'

export const USERS_KEY = ['users'] as const

export const useUsers = () =>
  useQuery({ queryKey: USERS_KEY, queryFn: usersApi.getAll })

export const useUser = (id: number) =>
  useQuery({
    queryKey: [...USERS_KEY, id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  })

export const useCreateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: UserCreate) => usersApi.create(body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: USERS_KEY }); toast.success('User created successfully') },
    onError: (e: Error) => toast.error(e.message),
  })
}

export const useUpdateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UserUpdate }) => usersApi.update(id, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: USERS_KEY }); toast.success('User updated successfully') },
    onError: (e: Error) => toast.error(e.message),
  })
}

export const useDeleteUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => usersApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: USERS_KEY }); toast.success('User deleted') },
    onError: (e: Error) => toast.error(e.message),
  })
}
