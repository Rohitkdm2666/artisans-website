import React from 'react'

type ButtonVariant = 'primary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  as?: 'button' | 'a'
  href?: string
  children: React.ReactNode
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  as = 'button',
  href,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const classes = ['btn', variantClass[variant], sizeClass[size], className]
    .filter(Boolean)
    .join(' ')

  if (as === 'a' && href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          <span className="sr-only">Loading…</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
