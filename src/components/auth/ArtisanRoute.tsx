import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LoadingState } from '@/components/ui/LoadingState'

/**
 * ArtisanRoute — protects routes requiring the 'artisan' role.
 */
export function ArtisanRoute() {
  const { user, profile, authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-base)' }}>
        <LoadingState message="Loading…" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login?next=%2Fartisan" replace />
  }

  if (user && profile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-base)' }}>
        <LoadingState message="Loading…" />
      </div>
    )
  }

  if (profile?.role !== 'artisan' && profile?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
