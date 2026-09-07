import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Globe, AtSign, Mail, MapPin } from 'lucide-react'

const FOOTER_LINKS = {
  shop: [
    { label: 'All Products', href: '/products' },
    { label: 'Meet the Artisans', href: '/artisans' },
  ],
  business: [
    { label: 'Business Overview', href: '/business' },
    { label: 'Browse Products', href: '/business/products' },
    { label: 'B2B Requests', href: '/business/requests' },
    { label: 'Orders', href: '/business/orders' },
  ],
  account: [
    { label: 'Log In', href: '/login' },
    { label: 'Create Account', href: '/signup' },
  ],
}

const SOCIAL = [
  { label: 'Website', icon: Globe, href: '#' },
  { label: 'Social', icon: AtSign, href: '#' },
  { label: 'Email Us', icon: Mail, href: 'mailto:hello@dor.in' },
]

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-brown-800)',
        color: 'var(--color-beige-200)',
        borderTop: '3px solid var(--color-primary)',
      }}
    >
      {/* Main footer body */}
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand column */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link to="/" style={{ textDecoration: 'none' }} aria-label="Dor Home">
              <div>
                <p
                  className="font-serif"
                  style={{
                    fontSize: '2rem',
                    fontWeight: 600,
                    color: 'var(--color-beige-100)',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Dor
                </p>
                <p
                  style={{
                    fontSize: '0.65rem',
                    color: 'var(--color-gold-300)',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-sans)',
                    marginTop: '2px',
                  }}
                >
                  डोर
                </p>
              </div>
            </Link>

            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-brown-300)',
                lineHeight: 1.7,
              }}
            >
              Celebrating the skill and soul of India's artisan communities — connecting
              makers with people who truly value craft.
            </p>

            <div className="flex items-center gap-1" style={{ color: 'var(--color-brown-300)', fontSize: 'var(--font-size-xs)' }}>
              <MapPin size={12} style={{ flexShrink: 0 }} />
              <span>Made with love in India</span>
            </div>

            {/* Social icons */}
            <div className="flex gap-3 mt-2">
              {SOCIAL.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    color: 'var(--color-brown-300)',
                    transition: 'color var(--duration-fast) ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    border: '1px solid var(--color-brown-600)',
                    borderRadius: 'var(--radius-card)',
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <FooterColumn title="Shop" links={FOOTER_LINKS.shop} />
            <FooterColumn title="Business" links={FOOTER_LINKS.business} />
            <FooterColumn title="Account" links={FOOTER_LINKS.account} />
          </div>
        </div>
      </Container>

      {/* Ornamental divider */}
      <div
        className="divider-ornamental mx-auto"
        style={{
          maxWidth: '400px',
          padding: '0 1.5rem',
          color: 'var(--color-brown-500)',
          fontSize: '0.7rem',
        }}
      >
        ✦
      </div>

      {/* Bottom bar */}
      <Container>
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-3 py-6"
          style={{
            borderTop: '1px solid var(--color-brown-700)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-brown-400)',
          }}
        >
          <p>
            © {new Date().getFullYear()} Dor. All rights reserved.
          </p>
          <p style={{ letterSpacing: '0.04em' }}>
            Crafted with respect for Indian heritage.
          </p>
        </div>
      </Container>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--font-size-xs)',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--color-gold-400)',
        }}
      >
        {title}
      </p>
      <ul className="flex flex-col gap-2 list-none p-0 m-0">
        {links.map(({ label, href }) => (
          <li key={href}>
            <Link
              to={href}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-brown-300)',
                textDecoration: 'none',
                transition: 'color var(--duration-fast) ease',
              }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
