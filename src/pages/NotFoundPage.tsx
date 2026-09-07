import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Home } from 'lucide-react'

/**
 * NotFoundPage — 404
 */
export default function NotFoundPage() {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-bg-base)' }}
    >
      <Container>
        <div className="flex flex-col items-center text-center gap-5 py-20">
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '7rem',
              fontWeight: 600,
              lineHeight: 1,
              color: 'var(--color-border-dark)',
            }}
            aria-hidden="true"
          >
            404
          </span>

          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--color-accent-muted)',
            }}
          >
            ✦ &nbsp; Page Not Found &nbsp; ✦
          </span>

          <h1 className="text-h2" style={{ color: 'var(--color-text-base)' }}>
            This page wandered off.
          </h1>

          <p style={{ fontSize: 'var(--font-size-lead)', color: 'var(--color-text-muted)', maxWidth: '380px' }}>
            The page you're looking for doesn't exist or may have been moved.
          </p>

          <Link to="/">
            <Button variant="primary" size="lg">
              <Home size={16} />
              Back to Home
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  )
}
