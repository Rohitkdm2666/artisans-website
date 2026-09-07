import { Link } from 'react-router-dom'
import { Card, CardBody, CardImage } from '@/components/ui/Card'
import { getArtisanImageUrl } from '@/lib/storage'
import { MapPin } from 'lucide-react'
import type { ArtisanProfile } from '@/types'

export function ArtisanCard({ artisan }: { artisan: ArtisanProfile }) {
  const imageUrl = getArtisanImageUrl(artisan.profile_photo_path)

  return (
    <Link to={`/artisans/${artisan.id}`} className="block no-underline group">
      <Card elevated className="h-full transition-transform duration-300 hover:-translate-y-1">
        <CardImage
          src={imageUrl}
          alt={artisan.display_name}
          aspectRatio="3/4"
        />
        <CardBody className="flex flex-col gap-2">
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-primary)',
              fontWeight: 600,
              marginBottom: '0.25rem',
            }}
          >
            {artisan.craft_summary || 'Master Artisan'}
          </p>
          <h3
            className="font-serif leading-tight"
            style={{
              fontSize: '1.4rem',
              color: 'var(--color-text-base)',
              fontWeight: 600,
            }}
          >
            {artisan.display_name}
          </h3>

          {(artisan.location_city || artisan.location_state) && (
            <div
              className="flex items-center gap-1 mt-1"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
              }}
            >
              <MapPin size={12} />
              <span>
                {[artisan.location_city, artisan.location_state].filter(Boolean).join(', ')}
              </span>
            </div>
          )}

          {artisan.craft_summary && (
            <p
              className="mt-3 line-clamp-3"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-muted)',
                lineHeight: 1.5,
              }}
            >
              {artisan.craft_summary}
            </p>
          )}

          <div className="mt-auto pt-4 flex items-center text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
            Read Story &rarr;
          </div>
        </CardBody>
      </Card>
    </Link>
  )
}
