import React from 'react'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export function Container({ children, className = '', as: Tag = 'div' }: ContainerProps) {
  return (
    <Tag className={`container-base ${className}`}>
      {children}
    </Tag>
  )
}
