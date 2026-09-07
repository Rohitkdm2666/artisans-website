import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { LoadingState } from '@/components/ui/LoadingState'
import { EmptyState } from '@/components/ui/EmptyState'
import { ArtisanCard } from '@/components/ui/ArtisanCard'
import { Users, AlertCircle } from 'lucide-react'
import { usePublicArtisans } from '@/hooks/useArtisans'

export default function ArtisansPage() {
  const { artisans, status, error } = usePublicArtisans()

  return (
    <div className="pt-6 pb-16 min-h-screen">
      <Container>
        <SectionHeading
          title="Meet Our Artisans"
          className="mb-6"
          ornament={false}
        />

        {status === 'loading' && <LoadingState message="Loading artisan directory..." />}

        {status === 'error' && (
          <div className="py-12 text-center text-red-700">
            <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="font-serif text-2xl mb-2">Something went wrong</h3>
            <p>{typeof error === 'string' ? error : JSON.stringify(error)}</p>
          </div>
        )}

        {status === 'success' && artisans.length === 0 && (
          <EmptyState
            icon={<Users size={28} />}
            title="No Artisans Found"
            description="We are currently updating our artisan directory. Please check back later."
          />
        )}

        {status === 'success' && artisans.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {artisans.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}
