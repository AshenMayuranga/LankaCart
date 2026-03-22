import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Truck, HeadphonesIcon, RefreshCw, Smartphone, Shirt, Home as HomeIcon, UtensilsCrossed, Dumbbell, Sparkles } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/products/ProductCard'

const categories = [
  { name: 'Electronics', icon: Smartphone, color: 'bg-blue-50 text-blue-600' },
  { name: 'Fashion', icon: Shirt, color: 'bg-purple-50 text-purple-600' },
  { name: 'Home & Garden', icon: HomeIcon, color: 'bg-brand-50 text-brand-600' },
  { name: 'Food & Beverage', icon: UtensilsCrossed, color: 'bg-amber-50 text-amber-600' },
  { name: 'Sports', icon: Dumbbell, color: 'bg-red-50 text-red-600' },
  { name: 'Beauty', icon: Sparkles, color: 'bg-pink-50 text-pink-600' },
]

const features = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders over LKR 5,000' },
  { icon: ShieldCheck, title: 'Secure Payment', desc: '100% secure transactions' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Dedicated support team' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '30-day hassle-free returns' },
]

export default function Home() {
  const { data: products, isLoading } = useProducts()
  const featured = products?.slice(0, 8) ?? []

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 text-white overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/15 text-white px-3 py-1 rounded-full mb-5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Sri Lanka's #1 Online Marketplace
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-5">
              Shop Everything<br />
              <span className="text-amber-400">You Love</span>
            </h1>
            <p className="text-lg text-brand-100 mb-8 leading-relaxed">
              Discover thousands of quality products from trusted sellers across Sri Lanka.
              Fast delivery, secure payments, and unbeatable prices.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products" className="btn-amber text-base px-6 py-3 font-semibold gap-2">
                Shop Now <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/15 text-white font-semibold text-base hover:bg-white/25 transition-colors backdrop-blur-sm">
                Join Free
              </Link>
            </div>
          </div>

          {/* Stat cards */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3">
            {[
              { value: '10,000+', label: 'Products' },
              { value: '50,000+', label: 'Customers' },
              { value: '500+', label: 'Sellers' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-brand-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
            <p className="text-sm text-gray-500 mt-1">Find exactly what you're looking for</p>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {categories.map(({ name, icon: Icon, color }) => (
            <Link
              key={name}
              to="/products"
              className={`flex flex-col items-center gap-2.5 p-4 rounded-xl ${color} hover:scale-105 transition-transform cursor-pointer group`}
            >
              <Icon className="h-7 w-7" />
              <span className="text-xs font-semibold text-center leading-tight">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-sm text-gray-500 mt-1">Handpicked selections for you</p>
          </div>
          <Link to="/products" className="btn-secondary text-sm gap-1.5 hidden sm:inline-flex">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="skeleton h-48" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-4 rounded w-3/4" />
                  <div className="skeleton h-3 rounded w-1/2" />
                  <div className="skeleton h-6 rounded w-1/3 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {products && products.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-sm">No products available yet. Check back soon!</p>
              </div>
            )}
            <div className="text-center mt-8">
              <Link to="/products" className="btn-primary gap-2">
                View All Products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-gradient-to-r from-amber-500 to-amber-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold">Ready to start shopping?</h2>
            <p className="text-amber-100 mt-1">Create your free account today and get exclusive deals.</p>
          </div>
          <Link to="/register" className="btn-primary bg-white text-amber-600 hover:bg-amber-50 active:bg-amber-100 shrink-0 font-semibold px-6 py-3">
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  )
}
