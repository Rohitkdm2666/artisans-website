import { supabase } from '@/lib/supabase'

// Assuming the bucket is named 'product-images' based on common conventions.
// If it's different, this central helper makes it easy to update later.
const PRODUCT_IMAGES_BUCKET = 'product-media'
const ARTISAN_IMAGES_BUCKET = 'artisan-profiles'

export function getProductImageUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined

  // If it's already a full URL (e.g. from seed data), return it
  if (path.startsWith('http')) return path

  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export function getArtisanImageUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined

  // If it's already a full URL, return it
  if (path.startsWith('http')) return path

  const { data } = supabase.storage.from(ARTISAN_IMAGES_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
