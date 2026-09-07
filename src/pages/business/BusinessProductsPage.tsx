import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { LoadingState } from '@/components/ui/LoadingState'
import { ProductCard } from '@/components/ui/ProductCard'
import { Search, SlidersHorizontal, AlertCircle } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'

export default function BusinessProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategoryId, setActiveCategoryId] = useState<string>('')
  const [sortOption, setSortOption] = useState<'newest' | 'price_asc' | 'price_desc'>('newest')

  const { categories } = useCategories()
  const { products, status, error } = useProducts({
    search: searchQuery,
    category_id: activeCategoryId || undefined,
    sort: sortOption
  })

  return (
    <div className="section min-h-screen">
      <Container>
        <SectionHeading
          title="Product Catalogue"
          subtitle="Browse artisan products available for bulk sourcing."
          className="mb-8"
          align="left"
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

        {status === 'success' && products.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="font-serif text-2xl text-gray-700 mb-2">No products are available yet.</h3>
            <p className="text-gray-500">Check back later for new arrivals.</p>
          </div>
        )}

        {status === 'success' && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} hrefPrefix="/business/products" />
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}
