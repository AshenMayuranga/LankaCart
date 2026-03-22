import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Package, Search } from 'lucide-react'
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Modal from '@/components/ui/Modal'
import Table, { type Column } from '@/components/ui/Table'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number({ invalid_type_error: 'Enter a valid price' }).positive('Price must be positive'),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function AdminProducts() {
  const { data: products, isLoading } = useProducts()
  const { mutateAsync: create, isPending: creating } = useCreateProduct()
  const { mutateAsync: update, isPending: updating } = useUpdateProduct()
  const { mutateAsync: deleteProduct } = useDeleteProduct()

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [selected, setSelected] = useState<Product | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!products) return []
    if (!search) return products
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
    )
  }, [products, search])

  const {
    register, handleSubmit, reset, setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const openCreate = () => { reset({ name: '', price: 0, description: '' }); setModalMode('create') }

  const openEdit = (p: Product) => {
    setSelected(p)
    reset({ name: p.name, price: p.price, description: p.description ?? '' })
    setModalMode('edit')
    setValue('price', p.price)
  }

  const closeModal = () => { setModalMode(null); setSelected(null); reset() }

  const onSubmit = async (data: FormData) => {
    if (modalMode === 'create') {
      await create(data)
    } else if (modalMode === 'edit' && selected) {
      await update({ id: selected.id, body: data })
    }
    closeModal()
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return
    await deleteProduct(id)
  }

  const columns: Column<Product>[] = [
    { key: 'id', header: 'ID', className: 'w-16 text-gray-400 font-mono text-xs' },
    {
      key: 'name', header: 'Product',
      render: (p) => (
        <div>
          <p className="font-medium text-gray-900 text-sm">{p.name}</p>
          {p.description && <p className="text-xs text-gray-400 truncate max-w-xs">{p.description}</p>}
        </div>
      ),
    },
    {
      key: 'price', header: 'Price',
      render: (p) => <span className="font-semibold text-brand-600 text-sm">{formatCurrency(p.price)}</span>,
    },
    {
      key: 'actions', header: 'Actions',
      className: 'w-24',
      render: (p) => (
        <div className="flex items-center gap-1.5">
          <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ]

  const isSaving = creating || updating

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products?.length ?? 0} total products</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-base pl-9"
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filtered}
        loading={isLoading}
        emptyMessage="No products found"
        emptyIcon={<Package size={40} />}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalMode !== null}
        onClose={closeModal}
        title={modalMode === 'create' ? 'Add New Product' : 'Edit Product'}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button loading={isSaving} onClick={handleSubmit(onSubmit)}>
              {modalMode === 'create' ? 'Create Product' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Product Name"
            required
            placeholder="e.g. Ceylon Black Tea 250g"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Price (LKR)"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0.00"
            error={errors.price?.message}
            {...register('price', { valueAsNumber: true })}
          />
          <Textarea
            label="Description"
            placeholder="Product description (optional)"
            rows={3}
            {...register('description')}
          />
        </form>
      </Modal>
    </div>
  )
}
