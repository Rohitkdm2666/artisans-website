import { useState, useEffect, useCallback } from 'react'
import { getPublicArtisans, getArtisanById, getArtisanProfileByUserId } from '@/services/artisans'
import type { ArtisanProfile, ArtisanStory, LoadingState } from '@/types'

export function usePublicArtisans() {
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([])
  const [status, setStatus] = useState<LoadingState>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArtisans() {
      try {
        setStatus('loading')
        setError(null)
        const data = await getPublicArtisans()
        setArtisans(data)
        setStatus('success')
      } catch (err: any) {
        setError(err.message || 'Failed to load artisans.')
        setStatus('error')
      }
    }

    fetchArtisans()
  }, [])

  return { artisans, status, error }
}

export function useArtisanDetail(id: string | undefined) {
  const [artisan, setArtisan] = useState<{ profile: ArtisanProfile; story: ArtisanStory | null } | null>(null)
  const [status, setStatus] = useState<LoadingState>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    async function fetchDetail() {
      try {
        setStatus('loading')
        setError(null)
        const data = await getArtisanById(id as string)
        setArtisan(data)
        setStatus('success')
      } catch (err: any) {
        setError(err.message || 'Failed to load artisan details.')
        setStatus('error')
      }
    }

    fetchDetail()
  }, [id])

  return { artisan, status, error }
}

export function useArtisanProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<ArtisanProfile | null>(null)
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
      const data = await getArtisanProfileByUserId(userId)
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch artisan profile'))
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return { profile, isLoading, error, refresh: fetchProfile }
}
