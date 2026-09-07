// =====================================================
// ROLE CONSTANTS & HELPERS
// Single source of truth for all user role logic.
// Never scatter raw role strings through components.
// =====================================================

import type { Profile } from '@/types'

// ── Canonical role values ──────────────────────────
export const ROLES = {
  CUSTOMER: 'customer',
  ARTISAN:  'artisan',
  BUSINESS: 'business',
  ADMIN:    'admin',
} as const

export type UserRole = (typeof ROLES)[keyof typeof ROLES]

// ── Role predicate helpers ─────────────────────────

export function isCustomer(profile: Profile | null): boolean {
  return profile?.role === ROLES.CUSTOMER
}

export function isArtisan(profile: Profile | null): boolean {
  return profile?.role === ROLES.ARTISAN
}

export function isBusinessUser(profile: Profile | null): boolean {
  return profile?.role === ROLES.BUSINESS
}

export function isAdmin(profile: Profile | null): boolean {
  return profile?.role === ROLES.ADMIN
}

// Any authenticated role that can access business portal:
// business users and admins.
export function canAccessBusiness(profile: Profile | null): boolean {
  return isBusinessUser(profile) || isAdmin(profile)
}

// Default redirect after login based on role
export function getPostLoginRedirect(profile: Profile | null): string {
  if (canAccessBusiness(profile)) return '/business'
  return '/'
}
