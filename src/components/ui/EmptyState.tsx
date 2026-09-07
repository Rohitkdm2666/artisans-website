import React from 'react'
import { Button } from './Button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
  className?: string
}

/**
 * EmptyState
 * Used when a list or collection has no items to display.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-20 text-center ${className}`}
    >
      {icon && (
        <div
          className="w-16 h-16 flex items-center justify-center mb-2"
          style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card)',
            color: 'var(--color-text-light)',
            backgroundColor: 'var(--color-bg-muted)',
          }}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      {/* Ornamental divider above title */}
      <span
        className="text-xs uppercase tracking-[0.3em]"
        style={{ color: 'var(--color-accent-muted)' }}
        aria-hidden="true"
      >
        ✦ ✦ ✦
      </span>

      <h3 className="text-h3" style={{ color: 'var(--color-text-base)' }}>
        {title}
      </h3>

      {description && (
        <p className="text-lead max-w-sm" style={{ color: 'var(--color-text-muted)' }}>
          {description}
        </p>
      )}

      {action && (
        <div className="mt-2">
          {action.href ? (
            <Button as="a" href={action.href} variant="outline">
              {action.label}
            </Button>
          ) : (
            <Button variant="outline" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
