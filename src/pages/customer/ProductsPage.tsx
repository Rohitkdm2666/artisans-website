import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { LoadingState } from '@/components/ui/LoadingState'
import { ProductCard } from '@/components/ui/ProductCard'
import { Search, SlidersHorizontal, AlertCircle } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategoryId, setActiveCategoryId] = useState<string>('')
  const [sortOption, setSortOption] = useState<'newest' | 'price_asc' | 'price_desc'>('newest')
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all')
  const [priceFilter, setPriceFilter] = useState<'all' | 'under_1000' | '1000_5000' | 'over_5000'>('all')

  const { categories } = useCategories()
  const { products, status, error } = useProducts({
    search: searchQuery,
    category_id: activeCategoryId || undefined,
    sort: sortOption
  })

  // We could use debouncing here, but since Supabase is fast and we want a simple MVP,
  // we'll rely on simple state updates. If it gets heavy, we can add a submit button or debounce.
  // For now, we'll keep it as a controlled input.

  const filteredProducts = products.filter((product) => {
    // Availability
    const onHand = product.inventory?.quantity_on_hand || 0
    const reserved = product.inventory?.reserved_quantity || 0
    const qty = onHand - reserved
    if (availabilityFilter === 'in_stock' && qty <= 0) return false
    if (availabilityFilter === 'out_of_stock' && qty > 0) return false
    
    // Price
    if (priceFilter === 'under_1000' && product.price >= 1000) return false
    if (priceFilter === '1000_5000' && (product.price < 1000 || product.price > 5000)) return false
    if (priceFilter === 'over_5000' && product.price <= 5000) return false
    
    return true
  })

  return (
    <div className="pt-6 pb-16 min-h-screen">
      <Container>
        <SectionHeading
          title="Handcrafted Products"
          className="mb-6"
          ornament={false}
        />

        {/* Toolbar: Search, Filters, Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 pb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, materials, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border rounded outline-none focus:border-maroon-700"
              style={{
                borderColor: 'var(--color-border)',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-base)',
              }}
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-gray-500" />
            <select
              value={activeCategoryId}
              onChange={(e) => setActiveCategoryId(e.target.value)}
              className="bg-white border rounded px-3 py-2 outline-none"
              style={{
                borderColor: 'var(--color-border)',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-base)',
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2">
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="bg-white border rounded px-3 py-2 outline-none"
              style={{
                borderColor: 'var(--color-border)',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-base)',
              }}
            >
              <option value="all">Availability: All</option>
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value as any)}
              className="bg-white border rounded px-3 py-2 outline-none"
              style={{
                borderColor: 'var(--color-border)',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-base)',
              }}
            >
              <option value="all">Price: All</option>
              <option value="under_1000">Under ₹1000</option>
              <option value="1000_5000">₹1000 - ₹5000</option>
              <option value="over_5000">Over ₹5000</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="bg-white border rounded px-3 py-2 outline-none"
              style={{
                borderColor: 'var(--color-border)',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-base)',
              }}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        {status === 'loading' && <LoadingState message="Bringing India's craft to you..." />}

        {status === 'error' && (
          <div className="py-12 text-center text-red-700">
            <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="font-serif text-2xl mb-2">Something went wrong</h3>
            <p>{typeof error === 'string' ? error : JSON.stringify(error)}</p>
          </div>
        )}

        {status === 'success' && filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="font-serif text-2xl text-gray-700 mb-2">No products found.</h3>
            <p className="text-gray-500">Try adjusting your filters or search query.</p>
          </div>
        )}

        {status === 'success' && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}
