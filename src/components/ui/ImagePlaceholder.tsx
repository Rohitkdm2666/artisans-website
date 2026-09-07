import React from 'react'
import { ImageIcon } from 'lucide-react'

interface ImagePlaceholderProps {
  /** The exact path that will be used once the real image is supplied */
  src?: string
  alt: string
  aspectRatio?: string
  className?: string
  label?: string
}

/**
 * ImagePlaceholder
 *
 * Shows the real image when `src` resolves correctly.
 * Falls back to a warm, styled placeholder that keeps the layout intact
 * and shows the path that needs to be supplied.
 */
export function ImagePlaceholder({
  src,
  alt,
  aspectRatio = '4/3',
  className = '',
  label,
}: ImagePlaceholderProps) {
  const [hasError, setHasError] = React.useState(false)

  const showPlaceholder = !src || hasError

  return (
    <div
      className={`relative block overflow-hidden ${className}`}
      style={{
        aspectRatio,
        backgroundColor: 'var(--color-bg-muted)',
        borderRadius: 'var(--radius-image)',
      }}
    >
      {!showPlaceholder && (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      )}

      {showPlaceholder && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4"
          style={{ color: 'var(--color-text-light)' }}
        >
          {/* subtle Indian-style diamond motif */}
          <div
            className="w-8 h-8 flex items-center justify-center"
            style={{
              border: '1px solid var(--color-border-dark)',
              transform: 'rotate(45deg)',
            }}
          >
            <ImageIcon
              size={14}
              style={{ transform: 'rotate(-45deg)', color: 'var(--color-text-light)' }}
            />
          </div>

          <span
            className="text-center"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--font-size-xs)',
              letterSpacing: '0.05em',
              color: 'var(--color-text-light)',
              maxWidth: '80%',
            }}
          >
            {label ?? alt}
          </span>

          {src && (
            <code
              className="block"
              style={{
                fontSize: '0.6rem',
                color: 'var(--color-border-dark)',
                letterSpacing: 0,
                wordBreak: 'break-all',
                textAlign: 'center',
              }}
            >
              {src}
            </code>
          )}
        </div>
      )}
    </div>
  )
}
