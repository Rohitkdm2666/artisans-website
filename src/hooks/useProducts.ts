import { useState, useEffect } from 'react'
import { getProducts, getProductById, getProductsByArtisanId, type ProductFilters } from '@/services/products'
import type { ProductWithDetails, ProductFullDetails, LoadingState } from '@/types'

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [status, setStatus] = useState<LoadingState>('idle')
  const [error, setError] = useState<string | null>(null)

  // We use stringified filters for stable dependency array
  const filtersStr = JSON.stringify(filters)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setStatus('loading')
        setError(null)
        const parsedFilters = filtersStr ? JSON.parse(filtersStr) : undefined
        const data = await getProducts(parsedFilters)
        setProducts(data)
        setStatus('success')
      } catch (err: any) {
        setError(err.message || 'Failed to load products.')
        setStatus('error')
      }
    }

    fetchProducts()
  }, [filtersStr])

  return { products, status, error }
}

export function useProductDetail(id: string | undefined) {
  const [product, setProduct] = useState<ProductFullDetails | null>(null)
  const [status, setStatus] = useState<LoadingState>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    async function fetchDetail() {
      try {
        setStatus('loading')
        setError(null)
        const data = await getProductById(id as string)
        setProduct(data)
        setStatus('success')
      } catch (err: any) {
        setError(err.message || 'Failed to load product details.')
        setStatus('error')
      }
    }

    fetchDetail()
  }, [id])

  return { product, status, error }
}

export function useArtisanProducts(artisanId: string | undefined) {
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [status, setStatus] = useState<LoadingState>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!artisanId) return

    async function fetchProducts() {
      try {
        setStatus('loading')
        setError(null)
        const data = await getProductsByArtisanId(artisanId as string)
        setProducts(data)
        setStatus('success')
      } catch (err: any) {
        setError(err.message || 'Failed to load artisan products.')
        setStatus('error')
      }
    }

    fetchProducts()
  }, [artisanId])

  return { products, status, error }
}
