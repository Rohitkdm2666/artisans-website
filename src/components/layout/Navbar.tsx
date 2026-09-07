import React from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Search, ChevronDown, LogOut } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { useAuth } from '@/hooks/useAuth'

const CUSTOMER_NAV = [
  { label: 'Products', href: '/products' },
  { label: 'Artisans', href: '/artisans' },
]

const BUSINESS_NAV = [
  { label: 'Dashboard', href: '/business' },
  { label: 'Products',  href: '/business/products' },
  { label: 'Requests',  href: '/business/requests' },
  { label: 'Orders',    href: '/business/orders' },
]

export function Navbar() {
  const [mobileOpen,   setMobileOpen]   = React.useState(false)
  const [businessOpen, setBusinessOpen] = React.useState(false)
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)
  const location = useLocation()
  const navigate  = useNavigate()

  const { user, profile, authLoading, signOut } = useAuth()

  const isBusinessSection = location.pathname.startsWith('/business')
  const isArtisanSection  = location.pathname.startsWith('/artisan')

  React.useEffect(() => {
    setMobileOpen(false)
    setBusinessOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  async function handleSignOut() {
    setUserMenuOpen(false)
    await signOut()
    navigate('/')
  }

  // Display name: prefer profile full_name, fall back to email prefix
  const displayName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'Account'
  // Initial for avatar circle
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <header
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderBottom:    '1px solid var(--color-border)',
      }}
    >
      {/* Top announcement bar */}
      <div
        className="text-center py-2"
        style={{
          backgroundColor: 'var(--color-primary)',
          color:           'var(--color-beige-100)',
          fontSize:        'var(--font-size-xs)',
          letterSpacing:   '0.06em',
          fontFamily:      'var(--font-sans)',
        }}
      >
        Handcrafted by artisans across India &nbsp;✦&nbsp; Direct from maker to you
      </div>

      <nav>
        <Container className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex flex-col leading-tight"
            style={{ textDecoration: 'none' }}
            aria-label="Hastakala — Home"
          >
            <span
              className="font-serif"
              style={{
                fontSize:      '1.6rem',
                fontWeight:    600,
                color:         'var(--color-primary)',
                letterSpacing: '-0.02em',
                lineHeight:    1,
              }}
            >
              Hastakala
            </span>
            <span
              style={{
                fontSize:      '0.6rem',
                color:         'var(--color-accent-muted)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                fontFamily:    'var(--font-sans)',
              }}
            >
              हस्तकला
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {CUSTOMER_NAV.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                style={({ isActive }) => ({
                  fontFamily:    'var(--font-sans)',
                  fontSize:      'var(--font-size-sm)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase' as const,
                  fontWeight:    500,
                  color:         isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  textDecoration:'none',
                  borderBottom:  isActive ? '1px solid var(--color-primary)' : '1px solid transparent',
                  paddingBottom: '2px',
                  transition:    'color var(--duration-base) ease',
                })}
              >
                {item.label}
              </NavLink>
            ))}

            {/* Business dropdown trigger */}
            <div className="relative">
              <button
                id="business-nav-trigger"
                onClick={() => setBusinessOpen((v) => !v)}
                className="flex items-center gap-1"
                style={{
                  fontFamily:    'var(--font-sans)',
                  fontSize:      'var(--font-size-sm)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  fontWeight:    500,
                  color:         isBusinessSection ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  background:    'none',
                  border:        'none',
                  cursor:        'pointer',
                  padding:       0,
                }}
                aria-expanded={businessOpen}
                aria-haspopup="menu"
              >
                Business
                <ChevronDown
                  size={14}
                  style={{
                    transition: 'transform 200ms ease',
                    transform:  businessOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>

              {businessOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setBusinessOpen(false)}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute left-0 top-full mt-2 z-20 flex flex-col gap-1 py-2 min-w-44"
                    style={{
                      backgroundColor: 'var(--color-bg-surface)',
                      border:          '1px solid var(--color-border)',
                      borderRadius:    'var(--radius-card)',
                      boxShadow:       '0 4px 16px rgba(93,58,36,0.10)',
                    }}
                    role="menu"
                  >
                    {BUSINESS_NAV.map((item) => (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        role="menuitem"
                        style={({ isActive }) => ({
                          padding:         '0.5rem 1rem',
                          fontFamily:      'var(--font-sans)',
                          fontSize:        'var(--font-size-sm)',
                          color:           isActive ? 'var(--color-primary)' : 'var(--color-text-base)',
                          textDecoration:  'none',
                          backgroundColor: isActive ? 'var(--color-bg-muted)' : 'transparent',
                          display:         'block',
                          transition:      'background-color 150ms ease',
                        })}
                        onClick={() => setBusinessOpen(false)}
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Artisan Portal link — only for artisans */}
            {profile?.role === 'artisan' && (
              <NavLink
                to="/artisan"
                style={({ isActive }) => ({
                  fontFamily:    'var(--font-sans)',
                  fontSize:      'var(--font-size-sm)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase' as const,
                  fontWeight:    500,
                  color:         isActive || isArtisanSection ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  textDecoration:'none',
                  borderBottom:  isActive || isArtisanSection ? '1px solid var(--color-primary)' : '1px solid transparent',
                  paddingBottom: '2px',
                })}
              >
                Artisan Portal
              </NavLink>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="navbar-search-btn"
              aria-label="Search"
              style={{
                background:    'none',
                border:        'none',
                cursor:        'pointer',
                color:         'var(--color-text-muted)',
                padding:       '0.4rem',
                borderRadius:  '4px',
                transition:    'color var(--duration-fast) ease',
              }}
            >
              <Search size={18} />
            </button>

            {/* ── Auth state block ─────────────────── */}
            {authLoading ? (
              /* Skeleton placeholder — prevents flash of logged-out state */
              <div
                aria-hidden="true"
                style={{
                  width:        '4.5rem',
                  height:       '1.5rem',
                  borderRadius: 'var(--radius-btn)',
                  backgroundColor: 'var(--color-bg-muted)',
                  opacity:      0.6,
                }}
              />
            ) : user ? (
              /* ── Logged-in state ─── */
              <div className="relative">
                <button
                  id="navbar-user-menu-btn"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2"
                  style={{
                    background: 'none',
                    border:     'none',
                    cursor:     'pointer',
                    padding:    '0.2rem',
                  }}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                  aria-label="Account menu"
                >
                  {/* Avatar circle */}
                  <div
                    style={{
                      width:           '2rem',
                      height:          '2rem',
                      borderRadius:    '50%',
                      backgroundColor: 'var(--color-primary)',
                      color:           'var(--color-beige-100)',
                      display:         'flex',
                      alignItems:      'center',
                      justifyContent:  'center',
                      fontSize:        '0.8rem',
                      fontWeight:      600,
                      fontFamily:      'var(--font-sans)',
                      flexShrink:      0,
                    }}
                  >
                    {initial}
                  </div>
                  <ChevronDown
                    size={13}
                    style={{
                      color:      'var(--color-text-muted)',
                      transition: 'transform 200ms ease',
                      transform:  userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                      aria-hidden="true"
                    />
                    <div
                      className="absolute right-0 top-full mt-2 z-20 py-2 min-w-48"
                      style={{
                        backgroundColor: 'var(--color-bg-surface)',
                        border:          '1px solid var(--color-border)',
                        borderRadius:    'var(--radius-card)',
                        boxShadow:       '0 4px 16px rgba(93,58,36,0.10)',
                      }}
                      role="menu"
                    >
                      {/* User info header */}
                      <div
                        style={{
                          padding:      '0.5rem 1rem 0.75rem',
                          borderBottom: '1px solid var(--color-border)',
                          marginBottom: '0.25rem',
                        }}
                      >
                        <p
                          style={{
                            fontSize:   'var(--font-size-sm)',
                            fontWeight: 500,
                            color:      'var(--color-text-base)',
                          }}
                        >
                          {displayName}
                        </p>
                        <p
                          style={{
                            fontSize: 'var(--font-size-xs)',
                            color:    'var(--color-text-muted)',
                            marginTop: '2px',
                          }}
                        >
                          {user.email}
                        </p>
                      </div>

                      {/* Profile Link */}
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="block w-full text-left"
                        style={{
                          padding:         '0.5rem 1rem',
                          fontFamily:      'var(--font-sans)',
                          fontSize:        'var(--font-size-sm)',
                          color:           'var(--color-text-base)',
                          textDecoration:  'none',
                          transition:      'background-color 150ms ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        My Profile
                      </Link>

                      {/* Sign out */}
                      <button
                        id="navbar-signout-btn"
                        role="menuitem"
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full"
                        style={{
                          padding:         '0.5rem 1rem',
                          fontFamily:      'var(--font-sans)',
                          fontSize:        'var(--font-size-sm)',
                          color:           'var(--color-text-base)',
                          background:      'none',
                          border:          'none',
                          cursor:          'pointer',
                          textAlign:       'left',
                          width:           '100%',
                          transition:      'background-color 150ms ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* ── Logged-out state (unchanged visual design) ─── */
              <>
                <Link
                  to="/login"
                  style={{
                    fontFamily:    'var(--font-sans)',
                    fontSize:      'var(--font-size-sm)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    fontWeight:    500,
                    color:         'var(--color-text-muted)',
                    textDecoration:'none',
                  }}
                >
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            id="navbar-mobile-menu-btn"
            className="md:hidden p-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            style={{
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              color:      'var(--color-text-base)',
            }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </Container>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="md:hidden border-t"
            style={{
              borderColor:     'var(--color-border)',
              backgroundColor: 'var(--color-bg-surface)',
            }}
          >
            <Container className="py-4 flex flex-col gap-1">
              {CUSTOMER_NAV.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  style={({ isActive }) => ({
                    padding:       '0.65rem 0.5rem',
                    fontFamily:    'var(--font-sans)',
                    fontSize:      'var(--font-size-sm)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase' as const,
                    fontWeight:    500,
                    color:         isActive ? 'var(--color-primary)' : 'var(--color-text-base)',
                    textDecoration:'none',
                    borderBottom:  '1px solid var(--color-border)',
                    display:       'block',
                  })}
                >
                  {item.label}
                </NavLink>
              ))}

              <div
                className="pt-2"
                style={{ borderTop: '1px solid var(--color-border)', marginTop: '0.5rem' }}
              >
                <p
                  style={{
                    fontSize:      'var(--font-size-xs)',
                    color:         'var(--color-text-light)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom:  '0.5rem',
                  }}
                >
                  Business
                </p>
                {BUSINESS_NAV.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    style={({ isActive }) => ({
                      padding:       '0.5rem 0.5rem',
                      fontFamily:    'var(--font-sans)',
                      fontSize:      'var(--font-size-sm)',
                      color:         isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      textDecoration:'none',
                      display:       'block',
                    })}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              {/* Mobile auth actions */}
              {authLoading ? null : user ? (
                <div className="pt-4" style={{ borderTop: '1px solid var(--color-border)', marginTop: '0.5rem' }}>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                    Signed in as <strong style={{ color: 'var(--color-text-base)' }}>{displayName}</strong>
                  </p>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 mb-1"
                    style={{
                      fontFamily:    'var(--font-sans)',
                      fontSize:      'var(--font-size-sm)',
                      color:         'var(--color-text-base)',
                      textDecoration:'none',
                    }}
                  >
                    My Profile
                  </Link>
                  <button
                    id="mobile-signout-btn"
                    onClick={handleSignOut}
                    className="flex items-center gap-2"
                    style={{
                      background:    'none',
                      border:        'none',
                      cursor:        'pointer',
                      fontFamily:    'var(--font-sans)',
                      fontSize:      'var(--font-size-sm)',
                      color:         'var(--color-primary)',
                      padding:       '0.4rem 0',
                    }}
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 pt-4">
                  <Link to="/login" className="btn btn-outline btn-sm flex-1 text-center">
                    Login
                  </Link>
                  <Link to="/signup" className="btn btn-primary btn-sm flex-1 text-center">
                    Sign Up
                  </Link>
                </div>
              )}
            </Container>
          </div>
        )}
      </nav>
    </header>
  )
}
