import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { ROLES } from '@/lib/roles'
import type { UserRole } from '@/lib/roles'

// ── Validation schema ──────────────────────────────
const signUpSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters.')
    .max(80, 'Full name is too long.'),
  email:    z.string().email('Enter a valid email address.'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters.'),
  role: z.enum([ROLES.CUSTOMER, ROLES.BUSINESS] as [UserRole, ...UserRole[]]),
})
type SignUpFormData = z.infer<typeof signUpSchema>

// ── Shared styles ──────────────────────────────────
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
 * SignUpPage — connected to Supabase Auth
 * Keeps the existing visual design unchanged.
 * Adds: full-name + role fields, react-hook-form + zod, error/success banners.
 */
export default function SignUpPage() {
  const { signUp, user, authLoading } = useAuth()
  const navigate = useNavigate()

  // If already logged in, send to homepage
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/', { replace: true })
    }
  }, [authLoading, user, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { role: ROLES.CUSTOMER },
  })

  const [serverError,   setServerError]   = useState<string | null>(null)
  const [successMsg,    setSuccessMsg]     = useState<string | null>(null)

  async function onSubmit(data: SignUpFormData) {
    setServerError(null)
    setSuccessMsg(null)

    const errorMsg = await signUp(data.email, data.password, data.fullName, data.role)

    if (errorMsg) {
      setServerError(errorMsg)
      return
    }

    // Supabase sends a confirmation email by default.
    // Show a success message rather than navigating away.
    setSuccessMsg(
      'Account created! Please check your email and click the confirmation link to activate your account.'
    )
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
              Dor
            </p>
            <p
              style={{
                fontSize:      '0.6rem',
                color:         'var(--color-accent-muted)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              डोर
            </p>
          </Link>
          <p
            className="mt-4"
            style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}
          >
            Create your account
          </p>
        </div>

        {/* Success banner */}
        {successMsg && (
          <div
            role="status"
            className="flex items-start gap-2 mb-4 px-3 py-3 rounded"
            style={{
              backgroundColor: '#f0faf4',
              border:          '1px solid #86efac',
              color:           '#166534',
              fontSize:        'var(--font-size-sm)',
              borderRadius:    'var(--radius-btn)',
            }}
          >
            <CheckCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
            {successMsg}
          </div>
        )}

        {/* Server error banner */}
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

        {/* Form — hidden after successful signup */}
        {!successMsg && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label htmlFor="signup-name" style={labelStyle}>
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                style={errors.fullName ? inputErrorStyle : inputStyle}
                {...register('fullName')}
              />
              {errors.fullName && (
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)' }}>
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="signup-email" style={labelStyle}>
                Email Address
              </label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password" style={labelStyle}>
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
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

            {/* Account Type */}
            <div className="flex flex-col gap-1">
              <p style={labelStyle}>I am a</p>
              <div className="flex gap-3">
                {([
                  { value: ROLES.CUSTOMER, label: 'Conscious Shopper' },
                  { value: ROLES.BUSINESS, label: 'Business Buyer' },
                ] as const).map(({ value, label }) => (
                  <label
                    key={value}
                    htmlFor={`role-${value}`}
                    className="flex items-center gap-2 flex-1 cursor-pointer"
                    style={{
                      padding:         '0.6rem 0.75rem',
                      border:          '1px solid var(--color-border)',
                      borderRadius:    'var(--radius-btn)',
                      fontSize:        'var(--font-size-sm)',
                      color:           'var(--color-text-base)',
                      backgroundColor: 'var(--color-bg-base)',
                      userSelect:      'none',
                    }}
                  >
                    <input
                      id={`role-${value}`}
                      type="radio"
                      value={value}
                      style={{ accentColor: 'var(--color-primary)' }}
                      {...register('role')}
                    />
                    {label}
                  </label>
                ))}
              </div>
              {errors.role && (
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)' }}>
                  {errors.role.message}
                </p>
              )}
            </div>

            <Button
              id="signup-submit-btn"
              type="submit"
              className="w-full mt-2"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>
        )}

        <p
          className="text-center mt-6"
          style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
