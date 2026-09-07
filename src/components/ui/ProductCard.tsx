import { Link } from 'react-router-dom'
import { Card, CardBody, CardImage } from '@/components/ui/Card'
import { getProductImageUrl } from '@/lib/storage'
import type { ProductWithDetails } from '@/types'

export function ProductCard({ product }: { product: ProductWithDetails }) {
  const imageUrl = getProductImageUrl(
    product.primary_image?.thumbnail_path || product.primary_image?.original_path
  )

  // Calculate availability conceptually
  const qty = product.inventory ? (product.inventory.quantity_on_hand - product.inventory.reserved_quantity) : 0
  const isAvailable = qty > 0

  return (
    <Link to={`/products/${product.id}`} className="block no-underline group">
      <Card elevated className="h-full transition-transform duration-300 hover:-translate-y-1">
        <CardImage
          src={imageUrl}
          alt={product.name}
          aspectRatio="1/1"
        />
        <CardBody className="flex flex-col gap-2">
          <div className="flex justify-between items-start gap-4">
            <div>
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
                {product.category?.name || 'Uncategorized'}
              </p>
              <h3
                className="font-serif leading-tight"
                style={{
                  fontSize: '1.2rem',
                  color: 'var(--color-text-base)',
                  fontWeight: 600,
                }}
              >
                {product.name}
              </h3>
            </div>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-muted)',
              marginTop: '0.25rem',
            }}
          >
            By {product.artisan?.display_name || 'Hastakala Artisan'}
          </p>

          <div className="mt-auto pt-4 flex justify-between items-center border-t" style={{ borderColor: 'var(--color-border)' }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                color: 'var(--color-text-base)',
              }}
            >
              {product.currency} {product.price.toLocaleString()}
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600,
                color: isAvailable ? '#166534' : 'var(--color-maroon-300)',
              }}
            >
              {isAvailable ? 'Available' : 'Out of Stock'}
            </span>
          </div>
        </CardBody>
      </Card>
    </Link>
  )
}
