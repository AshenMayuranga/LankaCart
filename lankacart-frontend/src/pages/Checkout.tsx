import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { ShoppingCart, CheckCircle2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useCreateOrder } from '@/hooks/useOrders'
import { formatCurrency } from '@/lib/utils'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { toast } from 'sonner'

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(9, 'Valid phone required'),
  address: z.string().min(10, 'Full address required (min 10 characters)'),
  city: z.string().min(1, 'Required'),
  postalCode: z.string().min(5, 'Valid postal code required'),
})

type FormData = z.infer<typeof schema>

export default function Checkout() {
  const { items, clearCart, totalPrice } = useCartStore()
  const { user } = useAuthStore()
  const { mutateAsync: createOrder } = useCreateOrder()
  const navigate = useNavigate()
  const total = totalPrice()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
    },
  })

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    )
  }

  const onSubmit = async (data: FormData) => {
    const shippingAddress = `${data.address}, ${data.city} ${data.postalCode}`
    try {
      const promises = items.map((item) =>
        createOrder({
          userId: user?.id ?? 1,
          productId: item.product.id,
          quantity: item.quantity,
          totalPrice: item.product.price * item.quantity,
          status: 'PENDING',
          shippingAddress,
        })
      )
      await Promise.all(promises)
      clearCart()
      toast.success(`Order placed! ${items.length} item${items.length > 1 ? 's' : ''} confirmed.`, { icon: <CheckCircle2 className="text-brand-600" /> })
      navigate('/orders')
    } catch {
      toast.error('Failed to place order. Please check if services are running.')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping form */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Shipping Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  required
                  placeholder="Kasun"
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
                <Input
                  label="Last Name"
                  required
                  placeholder="Perera"
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
                <Input
                  label="Email"
                  type="email"
                  required
                  placeholder="kasun@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="Phone"
                  type="tel"
                  required
                  placeholder="+94 71 234 5678"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
                <div className="sm:col-span-2">
                  <Textarea
                    label="Shipping Address"
                    required
                    placeholder="No. 42, Galle Road"
                    error={errors.address?.message}
                    {...register('address')}
                  />
                </div>
                <Input
                  label="City"
                  required
                  placeholder="Colombo"
                  error={errors.city?.message}
                  {...register('city')}
                />
                <Input
                  label="Postal Code"
                  required
                  placeholder="00300"
                  error={errors.postalCode?.message}
                  {...register('postalCode')}
                />
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div className="rounded-lg border-2 border-brand-500 bg-brand-50 p-4 flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-brand-600 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-brand-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Pay when your order arrives</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shrink-0">
                      <span className="text-xs font-black text-white/40 uppercase">{item.product.name.slice(0, 2)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-semibold text-gray-900 shrink-0">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span><span className="font-medium text-gray-900">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span><span className="text-brand-600 font-medium">Free</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 mb-6 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-lg text-brand-600">{formatCurrency(total)}</span>
              </div>

              <Button
                type="submit"
                loading={isSubmitting}
                className="w-full py-3 text-base justify-center"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </Button>

              <p className="text-xs text-gray-400 text-center mt-3">
                By placing your order you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
