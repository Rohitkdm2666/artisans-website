import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { canAccessBusiness } from '@/lib/roles'
import { LoadingState } from '@/components/ui/LoadingState'

/**
 * BusinessRoute
 * Extends ProtectedRoute with a role check.
 *
 * Behaviour:
 *   • While auth is initialising → shows a full-page loading spinner
 *   • Not authenticated → redirects to /login?next=<path>
 *   • Authenticated but NOT a business/admin user → redirects to /
 *   • Authenticated business/admin user → renders children via <Outlet />
 */
export function BusinessRoute() {
  const { user, profile, authLoading } = useAuth()

  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-bg-base)' }}
      >
        <LoadingState message="Loading…" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login?next=%2Fbusiness" replace />
  }

  // Profile may still be loading a beat after user is set;
  // wait until profile is resolved before making role decision.
  if (user && profile === null) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-bg-base)' }}
      >
        <LoadingState message="Loading…" />
      </div>
    )
  }

  if (!canAccessBusiness(profile)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
