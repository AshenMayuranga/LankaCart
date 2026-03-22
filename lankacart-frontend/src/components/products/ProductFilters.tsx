import { Search, SlidersHorizontal, X } from 'lucide-react'

interface Props {
  search: string
  onSearchChange: (v: string) => void
  minPrice: string
  maxPrice: string
  onMinPriceChange: (v: string) => void
  onMaxPriceChange: (v: string) => void
  onReset: () => void
  resultCount: number
}

export default function ProductFilters({
  search, onSearchChange, minPrice, maxPrice,
  onMinPriceChange, onMaxPriceChange, onReset, resultCount,
}: Props) {
  const hasFilters = search || minPrice || maxPrice

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-base pl-9"
          />
          {search && (
            <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Price range */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            type="number"
            placeholder="Min LKR"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className="input-base w-28"
            min={0}
          />
          <span className="text-gray-400 text-sm shrink-0">–</span>
          <input
            type="number"
            placeholder="Max LKR"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="input-base w-28"
            min={0}
          />
        </div>

        {/* Reset + count */}
        <div className="flex items-center gap-2 shrink-0">
          {hasFilters && (
            <button onClick={onReset} className="btn-secondary py-1.5 px-3 text-xs gap-1">
              <X className="h-3.5 w-3.5" /> Reset
            </button>
          )}
          <span className="text-xs text-gray-400 whitespace-nowrap">{resultCount} result{resultCount !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  )
}
