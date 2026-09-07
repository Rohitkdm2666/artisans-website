import { useState, useEffect, useCallback } from 'react'
import { getBusinessProfile } from '@/services/businessProfile'
import type { BusinessProfile } from '@/types'

export function useBusinessProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<BusinessProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const data = await getBusinessProfile(userId)
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch business profile'))
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return { profile, isLoading, error, refresh: fetchProfile }
}
