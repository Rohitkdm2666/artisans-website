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
  const ratioStyle: React.CSSProperties = {
    aspectRatio,
    backgroundColor: 'var(--color-bg-muted)',
    overflow: 'hidden',
  }

  return (
    <div style={ratioStyle} className={`relative w-full ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          style={{ borderRadius: 0 }}
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
