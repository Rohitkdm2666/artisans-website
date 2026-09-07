import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { LoadingState } from '@/components/ui/LoadingState'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProductCard } from '@/components/ui/ProductCard'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, AlertCircle, MapPin, Award, Package, MessageCircle } from 'lucide-react'
import { useArtisanDetail } from '@/hooks/useArtisans'
import { useArtisanProducts } from '@/hooks/useProducts'
import { getArtisanImageUrl } from '@/lib/storage'
import { EnquiryModal } from '@/components/enquiries'
import { useCustomerEnquiries } from '@/hooks/useCustomerEnquiries'
import { useAuth } from '@/hooks/useAuth'

export default function ArtisanDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { artisan, status: artisanStatus, error: artisanError } = useArtisanDetail(id)
  const { products, status: productsStatus } = useArtisanProducts(id)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user } = useAuth()
  const customerId = user?.id
  const { submitEnquiry } = useCustomerEnquiries(customerId)

  if (artisanStatus === 'loading') {
    return (
      <div className="section">
        <Container>
          <LoadingState message="Loading artisan profile..." />
        </Container>
      </div>
    )
  }

  if (artisanStatus === 'error' || (!artisan && artisanStatus === 'success')) {
    return (
      <div className="section">
        <Container className="text-center py-20">
          <AlertCircle size={48} className="mx-auto mb-4 text-maroon-700 opacity-50" />
          <h2 className="font-serif text-2xl mb-4 text-maroon-900">Artisan Not Found</h2>
          <p className="text-gray-600 mb-8">{artisanError || "This artisan profile doesn't exist or is currently private."}</p>
          <Link to="/artisans" className="text-maroon-700 font-medium uppercase tracking-wider text-sm hover:underline">
            Return to Directory
          </Link>
        </Container>
      </div>
    )
  }

  if (!artisan) return null

  const { profile, story } = artisan
  const coverImage = getArtisanImageUrl(profile.profile_photo_path)

  return (
    <div className="bg-[#fdf8ed] min-h-screen">
      {/* Hero Header */}
      <div className="relative h-64 md:h-80 bg-gray-200 overflow-hidden">
        <img
          src={coverImage}
          alt={profile.display_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <Container className="relative h-full flex flex-col justify-end pb-8 text-white z-10">
          <Link
            to="/artisans"
            className="inline-flex items-center gap-2 mb-4 text-white/80 hover:text-white transition-colors uppercase text-xs tracking-wider font-sans"
          >
            <ArrowLeft size={14} /> Back to Artisans
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-2 shadow-sm">{profile.display_name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm font-sans tracking-wide">
            {(profile.location_city || profile.location_state) && (
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{[profile.location_city, profile.location_state].filter(Boolean).join(', ')}</span>
              </div>
            )}
            {profile.craft_summary && (
              <div className="flex items-center gap-1 text-amber-200">
                <Award size={14} />
                <span>{profile.craft_summary}</span>
              </div>
            )}
          </div>
        </Container>
      </div>

      <Container className="py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Artisan Story */}
        <div className="lg:col-span-2">
          <h2 className="font-serif text-3xl text-gray-900 mb-6">The Story</h2>
          <div className="prose prose-lg text-gray-700 font-sans leading-relaxed">
            {story?.content ? (
              // If we have a rich story, render it
              <p className="whitespace-pre-wrap">{story.content}</p>
            ) : (
              // Fallback to craft_summary
              <p className="whitespace-pre-wrap">{profile.craft_summary || "This artisan's detailed story is being documented."}</p>
            )}
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 border border-[#e5d8c8] rounded shadow-sm">
            <h3 className="font-serif text-xl mb-4 text-gray-900 border-b border-gray-100 pb-2">Artisan Details</h3>
            
            <div className="flex flex-col gap-3 text-sm font-sans">
              <div className="flex justify-between">
                <span className="text-gray-500">Craft Tradition</span>
                <span className="font-medium text-gray-900">{profile.craft_summary || 'Various'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Location</span>
                <span className="font-medium text-gray-900">{[profile.location_city, profile.location_state].filter(Boolean).join(', ') || 'India'}</span>
              </div>
              {profile.experience_years && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Experience</span>
                  <span className="font-medium text-gray-900">{profile.experience_years} Years</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Button */}
          <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={() => {
              if (!customerId) {
                window.location.href = `/login?redirect=/artisans/${profile.id}`
                return
              }
              setIsModalOpen(true)
            }}
          >
            <MessageCircle size={16} />
            Contact Artisan
          </Button>
        </div>
      </Container>

      {/* Artisan Products Collection */}
      <section className="bg-white py-16 border-t border-[#e5d8c8]">
        <Container>
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl text-gray-900 mb-3">Collection by {profile.display_name}</h2>
            <p className="text-gray-500 font-sans">Support their craft by shopping their authentic collection.</p>
          </div>

          {productsStatus === 'loading' && <LoadingState message="Loading collection..." />}

          {productsStatus === 'success' && products.length === 0 && (
            <EmptyState
              icon={<Package size={28} />}
              title="No Products Available"
              description={`${profile.display_name} doesn't have any published products at the moment.`}
            />
          )}

          {productsStatus === 'success' && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </Container>
      </section>
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        artisanName={profile.display_name}
        onSubmit={async (data) => {
          await submitEnquiry({
            artisan_profile_id: profile.id,
            ...data
          })
          alert('Your enquiry has been submitted successfully!')
        }}
      />
    </div>
  )
}
