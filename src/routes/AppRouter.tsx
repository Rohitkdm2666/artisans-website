import React, { Suspense, lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoadingState } from '@/components/ui/LoadingState'
import { BusinessRoute } from '@/components/auth/BusinessRoute'
import { ArtisanRoute } from '@/components/auth/ArtisanRoute'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

// --- Lazy-loaded customer pages ---
const HomePage             = lazy(() => import('@/pages/customer/HomePage'))
const ProductsPage         = lazy(() => import('@/pages/customer/ProductsPage'))
const ProductDetailPage    = lazy(() => import('@/pages/customer/ProductDetailPage'))
const ArtisansPage         = lazy(() => import('@/pages/customer/ArtisansPage'))
const ArtisanDetailPage    = lazy(() => import('@/pages/customer/ArtisanDetailPage'))
const ProfilePage          = lazy(() => import('@/pages/customer/ProfilePage'))

// --- Lazy-loaded artisan pages ---
const ArtisanDashboardPage    = lazy(() => import('@/pages/artisan/ArtisanDashboardPage'))
const ArtisanEnquiriesPage    = lazy(() => import('@/pages/artisan/ArtisanEnquiriesPage'))
const ArtisanBulkRequestsPage = lazy(() => import('@/pages/artisan/ArtisanBulkRequestsPage'))
const ArtisanOrdersPage       = lazy(() => import('@/pages/artisan/ArtisanOrdersPage'))

// --- Lazy-loaded business pages ---
const BusinessDashboardPage    = lazy(() => import('@/pages/business/BusinessDashboardPage'))
const BusinessProductsPage     = lazy(() => import('@/pages/business/BusinessProductsPage'))
const BusinessProductDetailPage = lazy(() => import('@/pages/business/BusinessProductDetailPage'))
const BusinessRequestsPage     = lazy(() => import('@/pages/business/BusinessRequestsPage'))
const BusinessRequestDetailPage = lazy(() => import('@/pages/business/BusinessRequestDetailPage'))
const BusinessOrdersPage       = lazy(() => import('@/pages/business/BusinessOrdersPage'))

// --- Lazy-loaded auth pages ---
const LoginPage  = lazy(() => import('@/pages/auth/LoginPage'))
const SignUpPage  = lazy(() => import('@/pages/auth/SignUpPage'))

// --- 404 ---
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

// Consistent suspense fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-base)' }}>
      <LoadingState message="Loading…" />
    </div>
  )
}

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  )
}

const router = createBrowserRouter([
  // ── Auth routes (no shared layout) ──────────────────────────────────────
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  {
    path: '/signup',
    element: withSuspense(SignUpPage),
  },

  // ── Main layout ─────────────────────────────────────────────────────────
  {
    element: <AppLayout />,
    children: [
      // ── Public customer routes ──────────────────────────────────────────
      {
        path: '/',
        element: withSuspense(HomePage),
      },
      {
        path: '/products',
        element: withSuspense(ProductsPage),
      },
      {
        path: '/products/:id',
        element: withSuspense(ProductDetailPage),
      },
      {
        path: '/artisans',
        element: withSuspense(ArtisansPage),
      },
      {
        path: '/artisans/:id',
        element: withSuspense(ArtisanDetailPage),
      },

      // ── Protected authenticated routes ────────────────────────────────────
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/profile',
            element: withSuspense(ProfilePage),
          },
        ],
      },

      // ── Artisan routes — requires authenticated artisan/admin role ────────
      {
        element: <ArtisanRoute />,
        children: [
          {
            path: '/artisan',
            element: withSuspense(ArtisanDashboardPage),
          },
          {
            path: '/artisan/enquiries',
            element: withSuspense(ArtisanEnquiriesPage),
          },
          {
            path: '/artisan/bulk-requests',
            element: withSuspense(ArtisanBulkRequestsPage),
          },
          {
            path: '/artisan/orders',
            element: withSuspense(ArtisanOrdersPage),
          },
        ],
      },

      // ── Business routes — requires authenticated business/admin role ────

      {
        element: <BusinessRoute />,
        children: [
          {
            path: '/business',
            element: withSuspense(BusinessDashboardPage),
          },
          {
            path: '/business/products',
            element: withSuspense(BusinessProductsPage),
          },
          {
            path: '/business/products/:id',
            element: withSuspense(BusinessProductDetailPage),
          },
          {
            path: '/business/requests',
            element: withSuspense(BusinessRequestsPage),
          },
          {
            path: '/business/requests/:id',
            element: withSuspense(BusinessRequestDetailPage),
          },
          {
            path: '/business/orders',
            element: withSuspense(BusinessOrdersPage),
          },
        ],
      },

      // ── 404 ──────────────────────────────────────────────────────────────
      {
        path: '*',
        element: withSuspense(NotFoundPage),
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
