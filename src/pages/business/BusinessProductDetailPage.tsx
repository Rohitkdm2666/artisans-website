import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { LoadingState } from '@/components/ui/LoadingState'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, AlertCircle, MapPin, Palette } from 'lucide-react'
import { useProductDetail } from '@/hooks/useProducts'
import { getProductImageUrl } from '@/lib/storage'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { BulkRequestModal } from '@/components/business'
import { useBulkRequests } from '@/hooks/useBulkRequests'
import { useAuth } from '@/hooks/useAuth'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'

export default function BusinessProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { product, status, error } = useProductDetail(id)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const { profile } = useAuth()

  const { profile: businessProfile } = useBusinessProfile(profile?.id)
  const businessProfileId = businessProfile?.id

  const { createRequest } = useBulkRequests(businessProfileId, 'business')

  if (status === 'loading') {
    return (
      <div className="section">
        <Container>
          <LoadingState message="Loading product details..." />
        </Container>
      </div>
    )
  }

  if (status === 'error' || (!product && status === 'success')) {
    return (
      <div className="section">
        <Container className="text-center py-20">
          <AlertCircle size={48} className="mx-auto mb-4 text-maroon-700 opacity-50" />
          <h2 className="font-serif text-2xl mb-4 text-maroon-900">Product Not Found</h2>
          <p className="text-gray-600 mb-8">{error || "The product you're looking for doesn't exist."}</p>
          <Button as="a" href="/business/products">Return to Catalogue</Button>
        </Container>
      </div>
    )
  }

  if (!product) return null

  const images = product.images && product.images.length > 0
    ? [...product.images]
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        .map(img => getProductImageUrl(img.enhanced_path || img.original_path))
    : [getProductImageUrl(null)]

  return (
    <div className="section min-h-screen">
      <Container>
        <Link
          to="/business/products"
          className="inline-flex items-center gap-2 mb-8"
          style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', textDecoration: 'none', letterSpacing: '0.04em', textTransform: 'uppercase' }}
        >
          <ArrowLeft size={14} /> Back to Catalogue
        </Link>

        {successMsg && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg text-sm">
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              <ImagePlaceholder src={images[activeImageIndex]} alt={product.name} className="w-full h-full" aspectRatio="1/1" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 flex-shrink-0 border-2 overflow-hidden ${activeImageIndex === idx ? 'border-maroon-700' : 'border-transparent'}`}
                  >
                    <ImagePlaceholder src={imgUrl} alt={`${product.name} view ${idx + 1}`} className="w-full h-full" aspectRatio="1/1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-xs font-sans tracking-widest uppercase text-maroon-700 font-semibold mb-2">
              {product.category?.name || 'Uncategorized'}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4 leading-tight">{product.name}</h1>
            <p className="text-2xl text-gray-900 font-medium mb-2">{product.currency} {product.price.toLocaleString()} / unit</p>
            <p className="text-sm text-gray-500 mb-6 font-sans">Retail unit price — bulk pricing negotiated directly with artisan</p>

            <div className="prose prose-sm text-gray-600 mb-8 font-sans">
              <p>{product.description || 'An authentic handcrafted piece.'}</p>
            </div>

            <div className="flex flex-col gap-3 mb-8 text-sm font-sans text-gray-700">
              {product.material && (
                <div className="grid grid-cols-3">
                  <span className="text-gray-500 font-medium uppercase text-xs tracking-wider">Material</span>
                  <span className="col-span-2">{product.material}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="grid grid-cols-3">
                  <span className="text-gray-500 font-medium uppercase text-xs tracking-wider">Dimensions</span>
                  <span className="col-span-2">{product.dimensions}</span>
                </div>
              )}
              {product.primary_colour && (
                <div className="flex items-start gap-4">
                  <Palette className="w-5 h-5 text-maroon-700 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Color</h3>
                    <p className="text-gray-600 capitalize">{product.primary_colour}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-b py-6 mb-8 border-gray-200">
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  if (!profile) {
                    window.location.href = `/login?redirect=/business/products/${product.id}`
                    return
                  }
                  setIsModalOpen(true)
                }}
              >
                Request Bulk Order Quote
              </Button>
              <p className="text-xs text-center text-gray-500 mt-3 font-sans">
                Submit your quantity, target price and specifications. The artisan will review and respond.
              </p>
            </div>

            {product.artisan && (
              <div className="bg-[#fdf8ed] p-6 border border-[#e5d8c8]">
                <h3 className="font-serif text-lg mb-2">Crafted by {product.artisan.display_name}</h3>
                {(product.artisan.location_city || product.artisan.location_state) && (
                  <div className="flex items-center gap-1 mt-1 text-gray-500">
                    <MapPin size={14} />
                    <span>{[product.artisan.location_city, product.artisan.location_state].filter(Boolean).join(', ')}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>

      {product.artisan && (
        <BulkRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productName={product.name}
          artisanName={product.artisan.display_name}
          onSubmit={async (data) => {
            if (!businessProfileId) {
              throw new Error('Business profile not found. Please complete your business profile setup.')
            }
            await createRequest({
              artisan_profile_id: product.artisan!.id,
              product_id: product.id,
              ...data
            })
            setSuccessMsg('Your bulk order request has been submitted! Check B2B Requests to track progress.')
          }}
        />
      )}
    </div>
  )
}
