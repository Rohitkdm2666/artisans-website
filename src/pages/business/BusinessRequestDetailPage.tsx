import { useParams, Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { LoadingState } from '@/components/ui/LoadingState'
import { ArrowLeft } from 'lucide-react'

export default function BusinessRequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  return (
    <div className="section">
      <Container>
        <Link
          to="/business/requests"
          className="flex items-center gap-2 mb-8"
          style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', textDecoration: 'none', letterSpacing: '0.04em', textTransform: 'uppercase' }}
        >
          <ArrowLeft size={14} /> Back to Requests
        </Link>
        <LoadingState message={`Loading request ${id}…`} />
      </Container>
    </div>
  )
}
