import { useState, useEffect, useCallback } from 'react'
import { getBusinessOrders, getArtisanOrders } from '../services/bulkOrders'
import type { Order } from '../types'

type Role = 'business' | 'artisan'

export function useOrders(profileId: string | undefined, role: Role) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchOrders = useCallback(async () => {
    if (!profileId) {
      setOrders([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const data = role === 'business'
        ? await getBusinessOrders(profileId)
        : await getArtisanOrders(profileId)
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch orders'))
    } finally {
      setIsLoading(false)
    }
  }, [profileId, role])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return {
    orders,
    isLoading,
    error,
    refresh: fetchOrders
  }
}
