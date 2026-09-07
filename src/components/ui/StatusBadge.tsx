// 

export type StatusType = 
  | 'open' | 'responded' | 'closed'
  | 'requested' | 'under_review' | 'accepted' | 'rejected' | 'confirmed' | 'cancelled'
  | 'placed' | 'in_production' | 'shipped' | 'delivered'
  | 'published' | 'draft' | 'archived'

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStyles = (s: StatusType) => {
    switch (s) {
      // Enquiry Statuses
      case 'open':
      case 'requested':
      case 'placed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'responded':
      case 'under_review':
      case 'in_production':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'accepted':
      case 'confirmed':
      case 'shipped':
      case 'delivered':
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'closed':
      case 'cancelled':
      case 'archived':
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatLabel = (s: string) => {
    return s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles(status)} ${className}`}>
      {formatLabel(status)}
    </span>
  )
}
