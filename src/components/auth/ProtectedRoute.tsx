import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LoadingState } from '@/components/ui/LoadingState'

/**
 * ProtectedRoute
 * Renders child routes only when the user is authenticated.
 *
 * Behaviour:
 *   • While auth is initialising → shows a full-page loading spinner
 *     (prevents a flash of the redirect before the session loads)
 *   • Not authenticated → redirects to /login, preserving the original
 *     path as ?next= so the user lands back after sign-in
 *   • Authenticated → renders children via <Outlet />
 */
export function ProtectedRoute() {
  const { user, authLoading } = useAuth()
  const location = useLocation()

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
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(location.pathname)}`}
        replace
      />
    )
  }

  return <Outlet />
}
