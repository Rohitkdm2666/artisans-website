import { useState, useEffect, useCallback } from 'react'
import { getArtisanEnquiries, respondToEnquiry } from '../services/enquiries'
import type { CustomerEnquiry } from '../types'

export function useArtisanEnquiries(artisanProfileId: string | undefined) {
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchEnquiries = useCallback(async () => {
    if (!artisanProfileId) {
      setEnquiries([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const data = await getArtisanEnquiries(artisanProfileId)
      setEnquiries(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch artisan enquiries'))
    } finally {
      setIsLoading(false)
    }
  }, [artisanProfileId])

  useEffect(() => {
    fetchEnquiries()
  }, [fetchEnquiries])

  const respond = async (enquiryId: string, message: string) => {
    const updated = await respondToEnquiry(enquiryId, message)
    // Optimistic update
    setEnquiries(prev => prev.map(e => e.id === enquiryId ? { ...e, ...updated } : e))
    return updated
  }

  return {
    enquiries,
    isLoading,
    error,
    refresh: fetchEnquiries,
    respond
  }
}
