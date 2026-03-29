import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Users, Search } from 'lucide-react'
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/useUsers'
import type { User } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import Table, { type Column } from '@/components/ui/Table'

const createSchema = z.object({
  username: z.string().min(3, 'At least 3 characters'),
  email: z.string().email('Valid email required'),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  password: z.string().min(6, 'At least 6 characters'),
  phoneNumber: z.string().optional(),
  role: z.enum(['CUSTOMER', 'ADMIN']),
})

const editSchema = createSchema.extend({
  password: z.string().min(6, 'At least 6 characters').or(z.literal('')).optional(),
})

type CreateFormData = z.infer<typeof createSchema>
type EditFormData = z.infer<typeof editSchema>

export default function AdminUsers() {
  const { data: users, isLoading } = useUsers()
  const { mutateAsync: create, isPending: creating } = useCreateUser()
  const { mutateAsync: update, isPending: updating } = useUpdateUser()
  const { mutateAsync: deleteUser } = useDeleteUser()

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [selected, setSelected] = useState<User | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!users) return []
    if (!search) return users
    const q = search.toLowerCase()
    return users.filter((u) =>
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q)
    )
  }, [users, search])

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateFormData>({
    resolver: zodResolver(modalMode === 'edit' ? editSchema : createSchema) as never,
  })

  const openCreate = () => {
    reset({ username: '', email: '', firstName: '', lastName: '', password: '', phoneNumber: '', role: 'CUSTOMER' })
    setModalMode('create')
  }

  const openEdit = (u: User) => {
    setSelected(u)
    reset({ username: u.username, email: u.email, firstName: u.firstName, lastName: u.lastName, password: '', phoneNumber: u.phoneNumber ?? '', role: u.role ?? 'CUSTOMER' })
    setModalMode('edit')
  }

  const closeModal = () => { setModalMode(null); setSelected(null); reset() }

  const onSubmit = async (data: CreateFormData | EditFormData) => {
    if (modalMode === 'create') {
      await create(data as CreateFormData)
    } else if (modalMode === 'edit' && selected) {
      const body = { ...data } as Partial<CreateFormData>
      if (!body.password) delete body.password
      await update({ id: selected.id, body })
    }
    closeModal()
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return
    await deleteUser(id)
  }

  const columns: Column<User>[] = [
    { key: 'id', header: 'ID', className: 'w-16 text-gray-400 font-mono text-xs' },
    {
      key: 'username', header: 'User',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
            <span className="text-brand-700 text-xs font-bold">{u.firstName[0]?.toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{u.firstName} {u.lastName}</p>
            <p className="text-xs text-gray-400">@{u.username}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email', header: 'Email',
      render: (u) => <span className="text-sm text-gray-600">{u.email}</span>,
    },
    {
      key: 'role', header: 'Role',
      render: (u) => (
        <Badge className={u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-brand-100 text-brand-700'}>
          {u.role ?? 'CUSTOMER'}
        </Badge>
      ),
      className: 'w-28',
    },
    {
      key: 'phoneNumber', header: 'Phone',
      render: (u) => <span className="text-sm text-gray-500">{u.phoneNumber ?? '—'}</span>,
    },
    {
      key: 'actions', header: '',
      className: 'w-20',
      render: (u) => (
        <div className="flex items-center gap-1.5">
          <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ]

  const isSaving = creating || updating

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">{users?.length ?? 0} registered users</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text" placeholder="Search users..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="input-base pl-9"
        />
      </div>

      <Table
        columns={columns}
        data={filtered}
        loading={isLoading}
        emptyMessage="No users found"
        emptyIcon={<Users size={40} />}
      />

      <Modal
        isOpen={modalMode !== null}
        onClose={closeModal}
        title={modalMode === 'create' ? 'Add New User' : 'Edit User'}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button loading={isSaving} onClick={handleSubmit(onSubmit)}>
              {modalMode === 'create' ? 'Create User' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name" required placeholder="Kasun"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Last Name" required placeholder="Perera"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>
          <Input
            label="Username" required placeholder="kasun_perera"
            error={errors.username?.message}
            {...register('username')}
          />
          <Input
            label="Email" type="email" required placeholder="kasun@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label={modalMode === 'edit' ? 'New Password (leave blank to keep)' : 'Password'}
            type="password"
            required={modalMode === 'create'}
            placeholder={modalMode === 'edit' ? 'Leave blank to keep current' : 'Min 6 characters'}
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Phone Number" placeholder="+94 71 234 5678"
            {...register('phoneNumber')}
          />
          <Select
            label="Role"
            required
            options={[
              { value: 'CUSTOMER', label: 'Customer' },
              { value: 'ADMIN', label: 'Admin' },
            ]}
            error={errors.role?.message}
            {...register('role')}
          />
        </form>
      </Modal>
    </div>
  )
}
