import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import type { CartItem as CartItemType } from '@/types'

interface Props { item: CartItemType }

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeItem } = useCartStore()

  return (
    <div className="flex items-start gap-3 py-3">
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shrink-0">
        <span className="text-lg font-black text-white/30 uppercase">
          {item.product.name.slice(0, 2)}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.product.name}</p>
        <p className="text-xs text-brand-600 font-semibold mt-0.5">{formatCurrency(item.product.price)}</p>

        {/* Quantity stepper */}
        <div className="flex items-center gap-1 mt-2">
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            className="w-6 h-6 rounded flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            className="w-6 h-6 rounded flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <p className="text-sm font-semibold text-gray-900">
          {formatCurrency(item.product.price * item.quantity)}
        </p>
        <button
          onClick={() => removeItem(item.product.id)}
          className="text-gray-300 hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
