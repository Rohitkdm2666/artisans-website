import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { Package } from 'lucide-react'

export default function BusinessProductsPage() {
  return (
    <div className="section">
      <Container>
        <SectionHeading
          title="Product Catalogue"
          subtitle="Browse artisan products available for bulk sourcing."
          className="mb-12"
          align="left"
          ornament={false}
        />
        <EmptyState
          icon={<Package size={28} />}
          title="Product catalogue loading…"
          description="The B2B product catalogue will be available here."
        />
      </Container>
    </div>
  )
}
