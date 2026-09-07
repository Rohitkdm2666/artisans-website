import { useState, useEffect } from 'react'
import { getActiveCategories } from '@/services/categories'
import type { ProductCategory, LoadingState } from '@/types'

export function useCategories() {
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [status, setStatus] = useState<LoadingState>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setStatus('loading')
        setError(null)
        const data = await getActiveCategories()
        setCategories(data)
        setStatus('success')
      } catch (err: any) {
        setError(err.message || 'Failed to load categories.')
        setStatus('error')
      }
    }

    fetchCategories()
  }, [])

  return { categories, status, error }
}
