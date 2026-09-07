import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { getPostLoginRedirect } from '@/lib/roles'

// ── Validation schema ──────────────────────────────
const loginSchema = z.object({
  email:    z.string().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})
type LoginFormData = z.infer<typeof loginSchema>

// ── Shared input style ─────────────────────────────
const inputStyle: React.CSSProperties = {
  padding:         '0.65rem 0.85rem',
  border:          '1px solid var(--color-border)',
  borderRadius:    'var(--radius-btn)',
  backgroundColor: 'var(--color-bg-base)',
  fontFamily:      'var(--font-sans)',
  fontSize:        'var(--font-size-sm)',
  color:           'var(--color-text-base)',
  outline:         'none',
  width:           '100%',
}

const inputErrorStyle: React.CSSProperties = {
  ...inputStyle,
  border: '1px solid var(--color-primary)',
}

const labelStyle: React.CSSProperties = {
  fontSize:      'var(--font-size-xs)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color:         'var(--color-text-muted)',
  fontWeight:    500,
}

/**
 * LoginPage — connected to Supabase Auth
 * Keeps the existing visual design unchanged.
 */
export default function LoginPage() {
  const { signIn, user, profile, authLoading } = useAuth()
  const navigate       = useNavigate()
  const [searchParams] = useSearchParams()

  // If already logged in, skip the login page
  useEffect(() => {
    if (!authLoading && user) {
      const next = searchParams.get('next')
      navigate(next ?? getPostLoginRedirect(profile), { replace: true })
    }
  }, [authLoading, user, profile, navigate, searchParams])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const [serverError, setServerError] = useState<string | null>(null)

  async function onSubmit(data: LoginFormData) {
    setServerError(null)
    const errorMsg = await signIn(data.email, data.password)
    if (errorMsg) {
      setServerError(errorMsg)
      return
    }
    // Navigation handled by the useEffect above once user state updates
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-bg-muted)', padding: '2rem' }}
    >
      <div
        className="w-full max-w-md"
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          border:          '1px solid var(--color-border)',
          borderRadius:    'var(--radius-card)',
          padding:         '2.5rem',
        }}
      >
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <p
              className="font-serif"
              style={{
                fontSize:      '2rem',
                fontWeight:    600,
                color:         'var(--color-primary)',
                letterSpacing: '-0.02em',
                lineHeight:    1,
              }}
            >
              Hastakala
            </p>
            <p
              style={{
                fontSize:      '0.6rem',
                color:         'var(--color-accent-muted)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              हस्तकला
            </p>
          </Link>

          <p
            className="mt-4"
            style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}
          >
            Sign in to your account
          </p>
        </div>

        {/* Server-level error banner */}
        {serverError && (
          <div
            role="alert"
            className="flex items-center gap-2 mb-4 px-3 py-2 rounded"
            style={{
              backgroundColor: 'var(--color-maroon-50)',
              border:          '1px solid var(--color-maroon-200)',
              color:           'var(--color-primary)',
              fontSize:        'var(--font-size-sm)',
              borderRadius:    'var(--radius-btn)',
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            {serverError}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="login-email" style={labelStyle}>
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              style={errors.email ? inputErrorStyle : inputStyle}
              {...register('email')}
            />
            {errors.email && (
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)' }}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="login-password" style={labelStyle}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              style={errors.password ? inputErrorStyle : inputStyle}
              {...register('password')}
            />
            {errors.password && (
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)' }}>
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            id="login-submit-btn"
            type="submit"
            className="w-full mt-2"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p
          className="text-center mt-6"
          style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}
        >
          Don't have an account?{' '}
          <Link
            to="/signup"
            style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
