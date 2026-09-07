import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  elevated?: boolean
  as?: React.ElementType
  onClick?: () => void
}

export function Card({ children, className = '', elevated = false, as: Tag = 'div', onClick }: CardProps) {
  const classes = ['card', elevated ? 'card-elevated' : '', className].filter(Boolean).join(' ')
  return (
    <Tag className={classes} onClick={onClick}>
      {children}
    </Tag>
  )
}

interface CardBodyProps {
  children: React.ReactNode
  className?: string
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  )
}

interface CardImageProps {
  src?: string | null
  alt: string
  aspectRatio?: '1/1' | '4/3' | '3/4' | '3/2' | '16/9'
  className?: string
}

export function CardImage({ src, alt, aspectRatio = '4/3', className = '' }: CardImageProps) {
  const [hasError, setHasError] = React.useState(false)
  const showPlaceholder = !src || hasError

  const ratioStyle: React.CSSProperties = {
    aspectRatio,
    backgroundColor: 'var(--color-bg-muted)',
    overflow: 'hidden',
  }

  return (
    <div style={ratioStyle} className={`relative w-full ${className}`}>
      {!showPlaceholder ? (
        <img
          src={src as string}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          style={{ borderRadius: 0 }}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span
            className="text-xs font-sans uppercase tracking-widest"
            style={{ color: 'var(--color-text-light)' }}
          >
            {alt}
          </span>
        </div>
      )}
    </div>
  )
}
