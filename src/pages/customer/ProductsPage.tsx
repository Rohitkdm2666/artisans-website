import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { LoadingState } from '@/components/ui/LoadingState'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProductCard } from '@/components/ui/ProductCard'
import { Package, Search, SlidersHorizontal, AlertCircle } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategoryId, setActiveCategoryId] = useState<string>('')
  const [sortOption, setSortOption] = useState<'newest' | 'price_asc' | 'price_desc'>('newest')

  const { categories } = useCategories()
  const { products, status, error } = useProducts({
    search: searchQuery,
    category_id: activeCategoryId || undefined,
    sort: sortOption
  })

  // We could use debouncing here, but since Supabase is fast and we want a simple MVP,
  // we'll rely on simple state updates. If it gets heavy, we can add a submit button or debounce.
  // For now, we'll keep it as a controlled input.

  return (
    <div className="section min-h-screen">
      <Container>
        <SectionHeading
          title="Handcrafted Products"
          subtitle="Authentic artisan-made goods sourced directly from skilled craftspeople across India."
          className="mb-8"
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
        {status === 'loading' && <LoadingState message="Fetching products from artisans..." />}

        {status === 'error' && (
          <div className="py-12 text-center text-red-700">
            <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="font-serif text-2xl mb-2">Something went wrong</h3>
            <p>{error}</p>
          </div>
        )}

        {status === 'success' && products.length === 0 && (
          <EmptyState
            icon={<Package size={28} />}
            title="No products found"
            description="We couldn't find any products matching your search criteria. Try adjusting your filters."
          />
        )}

        {status === 'success' && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}
