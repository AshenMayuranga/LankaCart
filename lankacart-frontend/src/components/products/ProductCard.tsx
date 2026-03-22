import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Eye } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

interface Props { product: Product }

// Deterministic gradient per product id
const gradients = [
  'from-brand-400 to-brand-600',
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-amber-400 to-amber-600',
  'from-rose-400 to-rose-600',
  'from-teal-400 to-teal-600',
]

export default function ProductCard({ product }: Props) {
  const { addItem, openDrawer } = useCartStore()
  const navigate = useNavigate()
  const gradient = gradients[product.id % gradients.length]

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem(product)
    openDrawer()
  }

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="card overflow-hidden cursor-pointer group hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Product image placeholder */}
      <div className={`h-48 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
        <span className="text-5xl font-black text-white/30 select-none uppercase">
          {product.name.slice(0, 2)}
        </span>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md">
            <Eye className="h-5 w-5 text-gray-700" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 group-hover:text-brand-600 transition-colors">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-gray-400 line-clamp-1 mb-3">{product.description}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Price</p>
            <p className="text-base font-bold text-brand-600">{formatCurrency(product.price)}</p>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 active:bg-brand-800 transition-colors shadow-sm"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
