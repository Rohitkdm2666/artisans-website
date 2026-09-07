
interface SectionHeadingProps {
  title: string
  subtitle?: string
  ornament?: boolean
  align?: 'left' | 'center' | 'right'
  className?: string
  titleTag?: 'h1' | 'h2' | 'h3'
}

export function SectionHeading({
  title,
  subtitle,
  ornament = true,
  align = 'center',
  className = '',
  titleTag: TitleTag = 'h2',
}: SectionHeadingProps) {
  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[align]

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      {ornament && (
        <span
          className="text-xs font-sans uppercase tracking-[0.3em]"
          style={{ color: 'var(--color-accent-muted)' }}
          aria-hidden="true"
        >
          ✦ &nbsp; Hastakala &nbsp; ✦
        </span>
      )}
      <TitleTag className="text-h2" style={{ color: 'var(--color-text-base)' }}>
        {title}
      </TitleTag>
      {subtitle && (
        <p
          className="text-lead max-w-2xl"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {subtitle}
        </p>
      )}
      {ornament && (
        <div
          className="w-12 h-px mt-1"
          style={{ backgroundColor: 'var(--color-accent)' }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
