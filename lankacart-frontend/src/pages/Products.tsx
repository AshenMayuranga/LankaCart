import { useState, useMemo } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/products/ProductCard'
import ProductFilters from '@/components/products/ProductFilters'
import EmptyState from '@/components/ui/EmptyState'

export default function Products() {
  const { data: products, isLoading, isError } = useProducts()
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const filtered = useMemo(() => {
    if (!products) return []
    return products.filter((p) => {
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
      const matchesMin = !minPrice || p.price >= Number(minPrice)
      const matchesMax = !maxPrice || p.price <= Number(maxPrice)
      return matchesSearch && matchesMin && matchesMax
    })
  }, [products, search, minPrice, maxPrice])

  const handleReset = () => { setSearch(''); setMinPrice(''); setMaxPrice('') }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
        <p className="text-sm text-gray-500 mt-1">
          {isLoading ? 'Loading...' : `${products?.length ?? 0} products available`}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onReset={handleReset}
          resultCount={filtered.length}
        />
      </div>

      {/* Error state */}
      {isError && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600 mb-6">
          Failed to load products. Make sure the backend services are running.
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag size={56} />}
          title="No products found"
          description="Try adjusting your search filters to find what you're looking for."
          action={
            <button onClick={handleReset} className="btn-primary">
              Clear Filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
