import { useState, useEffect, useCallback } from 'react'
import { getCustomerEnquiries, createEnquiry } from '../services/enquiries'
import type { CustomerEnquiry } from '../types'

export function useCustomerEnquiries(customerId: string | undefined) {
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchEnquiries = useCallback(async () => {
    if (!customerId) {
      setEnquiries([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const data = await getCustomerEnquiries(customerId)
      setEnquiries(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch enquiries'))
    } finally {
      setIsLoading(false)
    }
  }, [customerId])

  useEffect(() => {
    fetchEnquiries()
  }, [fetchEnquiries])

  const submitEnquiry = async (data: { artisan_profile_id: string; product_id?: string; subject: string; message: string }) => {
    if (!customerId) throw new Error('Not authenticated')
    const newEnquiry = await createEnquiry({ ...data, customer_id: customerId })
    await fetchEnquiries() // Refresh the list
    return newEnquiry
  }

  return {
    enquiries,
    isLoading,
    error,
    refresh: fetchEnquiries,
    submitEnquiry
  }
}
