import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card, CardBody } from '@/components/ui/Card'
import { Package, FileText, ShoppingCart, ArrowRight } from 'lucide-react'

const QUICK_LINKS = [
  {
    icon: Package,
    title: 'Browse Products',
    description: 'Explore our full catalogue of artisan-made goods.',
    href: '/business/products',
  },
  {
    icon: FileText,
    title: 'B2B Requests',
    description: 'Submit and track your bulk sourcing requests.',
    href: '/business/requests',
  },
  {
    icon: ShoppingCart,
    title: 'Your Orders',
    description: 'Review order history and track fulfilment status.',
    href: '/business/orders',
  },
]

/**
 * BusinessDashboardPage — B2B overview / landing page
 * Full implementation coming in the next phase.
 */
export default function BusinessDashboardPage() {
  return (
    <div className="section">
      <Container>
        <SectionHeading
          title="Business Dashboard"
          subtitle="Welcome to the Dor B2B portal. Source authentic Indian craft at scale."
          className="mb-12"
          align="left"
          ornament={false}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {QUICK_LINKS.map(({ icon: Icon, title, description, href }) => (
            <Link key={href} to={href} style={{ textDecoration: 'none' }}>
              <Card elevated className="h-full">
                <CardBody className="flex flex-col gap-3 h-full">
                  <div
                    className="w-10 h-10 flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--color-bg-muted)',
                      borderRadius: 'var(--radius-card)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  <h3 className="text-h3" style={{ color: 'var(--color-text-base)' }}>
                    {title}
                  </h3>

                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', flex: 1 }}>
                    {description}
                  </p>

                  <span
                    className="flex items-center gap-1"
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--color-primary)',
                      fontWeight: 500,
                      marginTop: 'auto',
                    }}
                  >
                    Go <ArrowRight size={12} />
                  </span>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  )
}
