
interface LoadingStateProps {
  message?: string
  className?: string
}

/**
 * LoadingState
 * A minimal, elegant loading indicator in the brand palette.
 */
export function LoadingState({ message = 'Loading…', className = '' }: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-5 py-20 ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Animated diamond spinner — matches the Indian motif language */}
      <div className="relative w-10 h-10" aria-hidden="true">
        <div
          className="absolute inset-0 border-2 animate-spin"
          style={{
            borderColor: 'var(--color-border-dark)',
            borderTopColor: 'var(--color-primary)',
            borderRadius: '2px',
            transform: 'rotate(45deg)',
            animation: 'spin 1.2s linear infinite',
          }}
        />
      </div>

      <p
        className="text-body-sm uppercase tracking-widest"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {message}
      </p>
    </div>
  )
}
