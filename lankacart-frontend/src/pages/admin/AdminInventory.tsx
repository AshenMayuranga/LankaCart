import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Warehouse, Search } from 'lucide-react'
import { useInventory, useCreateInventory, useUpdateInventory, useDeleteInventory } from '@/hooks/useInventory'
import { formatDateTime, inventoryStatusColor } from '@/lib/utils'
import type { Inventory, InventoryStatus } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import Table, { type Column } from '@/components/ui/Table'

const schema = z.object({
  productId: z.number({ invalid_type_error: 'Required' }).int().positive('Must be a valid product ID'),
  quantity: z.number({ invalid_type_error: 'Required' }).int().min(0, 'Cannot be negative'),
  location: z.string().min(1, 'Location is required'),
  status: z.enum(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'] as const),
  supplier: z.string().optional(),
  warehouseCode: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const statusOptions = [
  { value: 'IN_STOCK', label: 'In Stock' },
  { value: 'LOW_STOCK', label: 'Low Stock' },
  { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
]

export default function AdminInventory() {
  const { data: inventory, isLoading } = useInventory()
  const { mutateAsync: create, isPending: creating } = useCreateInventory()
  const { mutateAsync: update, isPending: updating } = useUpdateInventory()
  const { mutateAsync: deleteItem } = useDeleteInventory()

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [selected, setSelected] = useState<Inventory | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!inventory) return []
    if (!search) return inventory
    const q = search.toLowerCase()
    return inventory.filter((i) =>
      i.location.toLowerCase().includes(q) ||
      String(i.productId).includes(q) ||
      (i.supplier?.toLowerCase().includes(q) ?? false) ||
      (i.warehouseCode?.toLowerCase().includes(q) ?? false)
    )
  }, [inventory, search])

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'IN_STOCK' },
  })

  const openCreate = () => {
    reset({ productId: 0, quantity: 0, location: '', status: 'IN_STOCK', supplier: '', warehouseCode: '' })
    setModalMode('create')
  }

  const openEdit = (item: Inventory) => {
    setSelected(item)
    reset({
      productId: item.productId, quantity: item.quantity, location: item.location,
      status: item.status, supplier: item.supplier ?? '', warehouseCode: item.warehouseCode ?? '',
    })
    setModalMode('edit')
  }

  const closeModal = () => { setModalMode(null); setSelected(null); reset() }

  const onSubmit = async (data: FormData) => {
    if (modalMode === 'create') {
      await create({ ...data, status: data.status as InventoryStatus })
    } else if (modalMode === 'edit' && selected) {
      await update({ id: selected.id, body: { ...data, status: data.status as InventoryStatus } })
    }
    closeModal()
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this inventory item?')) return
    await deleteItem(id)
  }

  const columns: Column<Inventory>[] = [
    { key: 'id', header: 'ID', className: 'w-16 text-gray-400 font-mono text-xs' },
    {
      key: 'productId', header: 'Product / Location',
      render: (i) => (
        <div>
          <p className="text-sm font-medium text-gray-900">Product #{i.productId}</p>
          <p className="text-xs text-gray-400">{i.location}</p>
        </div>
      ),
    },
    {
      key: 'quantity', header: 'Qty',
      render: (i) => <span className="text-sm font-semibold text-gray-900">{i.quantity}</span>,
      className: 'w-20',
    },
    {
      key: 'status', header: 'Status',
      render: (i) => <Badge className={inventoryStatusColor[i.status]}>{i.status.replace('_', ' ')}</Badge>,
    },
    {
      key: 'supplier', header: 'Supplier / Warehouse',
      render: (i) => (
        <div>
          <p className="text-xs text-gray-600">{i.supplier ?? '—'}</p>
          <p className="text-xs text-gray-400">{i.warehouseCode ?? '—'}</p>
        </div>
      ),
    },
    {
      key: 'lastUpdated', header: 'Last Updated',
      render: (i) => <span className="text-xs text-gray-400">{formatDateTime(i.lastUpdated)}</span>,
    },
    {
      key: 'actions', header: '',
      className: 'w-20',
      render: (i) => (
        <div className="flex items-center gap-1.5">
          <button onClick={() => openEdit(i)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => handleDelete(i.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
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
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">{inventory?.length ?? 0} items tracked</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text" placeholder="Search by product, location..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="input-base pl-9"
        />
      </div>

      <Table
        columns={columns}
        data={filtered}
        loading={isLoading}
        emptyMessage="No inventory items found"
        emptyIcon={<Warehouse size={40} />}
      />

      <Modal
        isOpen={modalMode !== null}
        onClose={closeModal}
        title={modalMode === 'create' ? 'Add Inventory Item' : 'Edit Inventory Item'}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button loading={isSaving} onClick={handleSubmit(onSubmit)}>
              {modalMode === 'create' ? 'Add Item' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Product ID"
              type="number"
              required
              placeholder="1"
              error={errors.productId?.message}
              {...register('productId', { valueAsNumber: true })}
            />
            <Input
              label="Quantity"
              type="number"
              required
              placeholder="100"
              error={errors.quantity?.message}
              {...register('quantity', { valueAsNumber: true })}
            />
          </div>
          <Input
            label="Location"
            required
            placeholder="Warehouse A - Shelf 3"
            error={errors.location?.message}
            {...register('location')}
          />
          <Select
            label="Status"
            required
            options={statusOptions}
            error={errors.status?.message}
            {...register('status')}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Supplier"
              placeholder="Supplier name"
              {...register('supplier')}
            />
            <Input
              label="Warehouse Code"
              placeholder="WH-001"
              {...register('warehouseCode')}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}
