import { useState, useEffect, useCallback } from 'react'
import { getBusinessBulkRequests, getArtisanBulkRequests, createBulkOrderRequest, updateBulkRequest } from '../services/bulkOrders'
import type { BulkOrderRequest } from '../types'

type Role = 'business' | 'artisan'

export function useBulkRequests(profileId: string | undefined, role: Role) {
  const [requests, setRequests] = useState<BulkOrderRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchRequests = useCallback(async () => {
    if (!profileId) {
      setRequests([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const data = role === 'business' 
        ? await getBusinessBulkRequests(profileId)
        : await getArtisanBulkRequests(profileId)
      setRequests(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch bulk requests'))
    } finally {
      setIsLoading(false)
    }
  }, [profileId, role])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const createRequest = async (data: any) => {
    if (role !== 'business' || !profileId) throw new Error('Not authorized')
    const newReq = await createBulkOrderRequest({ ...data, business_profile_id: profileId })
    await fetchRequests()
    return newReq
  }

  const updateStatus = async (requestId: string, updates: Partial<BulkOrderRequest>) => {
    const updated = await updateBulkRequest(requestId, updates)
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, ...updated } : r))
    return updated
  }

  return {
    requests,
    isLoading,
    error,
    refresh: fetchRequests,
    createRequest,
    updateStatus
  }
}
