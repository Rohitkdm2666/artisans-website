import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

interface AppLayoutProps {
  children?: React.ReactNode
}

/**
 * AppLayout
 * The root layout wrapper used by all customer-facing and business pages.
 * Renders the sticky Navbar, page content via <Outlet />, and the Footer.
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-bg-base)' }}
    >
      <Navbar />
      <main className="flex-1">
        {children ?? <Outlet />}
      </main>
      <Footer />
    </div>
  )
}
