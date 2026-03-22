import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShoppingCart, Minus, Plus, ArrowLeft, Share2, Tag } from 'lucide-react'
import { useProduct } from '@/hooks/useProducts'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import { toast } from 'sonner'

const gradients = [
  'from-brand-400 to-brand-600',
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-amber-400 to-amber-600',
  'from-rose-400 to-rose-600',
  'from-teal-400 to-teal-600',
]

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading, isError } = useProduct(Number(id))
  const { addItem, openDrawer } = useCartStore()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)

  const gradient = gradients[(Number(id) ?? 0) % gradients.length]

  const handleAddToCart = () => {
    if (!product) return
    addItem(product, quantity)
    openDrawer()
    toast.success(`${product.name} added to cart`)
  }

  const handleBuyNow = () => {
    if (!product) return
    addItem(product, quantity)
    navigate('/checkout')
  }

  if (isLoading) return <Spinner label="Loading product..." />
  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Product not found or failed to load.</p>
        <Link to="/products" className="btn-primary">Back to Products</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-gray-600 transition-colors">Products</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div>
          <div className={`rounded-2xl bg-gradient-to-br ${gradient} h-80 md:h-96 flex items-center justify-center`}>
            <span className="text-8xl font-black text-white/20 uppercase select-none">
              {product.name.slice(0, 2)}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }}
              className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-4 w-4 text-brand-400" />
            <span className="text-xs text-brand-600 font-medium bg-brand-50 px-2.5 py-0.5 rounded-full">
              In Stock
            </span>
          </div>

          <div className="mb-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Price</p>
            <p className="text-3xl font-extrabold text-brand-600">{formatCurrency(product.price)}</p>
          </div>

          {product.description && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Description</p>
              <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2.5 text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-5 py-2.5 font-semibold text-gray-900 border-x border-gray-200 min-w-[56px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  className="px-3 py-2.5 text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-gray-400">Max 99 per order</span>
            </div>
          </div>

          {/* Total */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total ({quantity} × {formatCurrency(product.price)})</span>
              <span className="font-bold text-gray-900 text-lg">{formatCurrency(product.price * quantity)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleAddToCart} variant="secondary" className="flex-1 py-3">
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </Button>
            <Button onClick={handleBuyNow} variant="amber" className="flex-1 py-3">
              Buy Now
            </Button>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-4 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors self-start"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        </div>
      </div>
    </div>
  )
}
