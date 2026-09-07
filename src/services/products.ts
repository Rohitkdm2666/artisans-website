import { supabase } from '@/lib/supabase'
import type { ProductWithDetails, ProductFullDetails } from '@/types'

export interface ProductFilters {
  search?: string
  category_id?: string
  sort?: 'newest' | 'price_asc' | 'price_desc'
}

export async function getProducts(filters?: ProductFilters): Promise<ProductWithDetails[]> {
  let query = supabase
    .from('products')
    .select(`
      *,
      artisan:artisan_profiles(*),
      category:product_categories(*),
      inventory(*),
      product_images(*)
    `)
    .eq('status', 'published')
    .is('deleted_at', null)

  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id)
  }

  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  if (filters?.sort) {
    if (filters.sort === 'price_asc') {
      query = query.order('price', { ascending: true })
    } else if (filters.sort === 'price_desc') {
      query = query.order('price', { ascending: false })
    } else {
      query = query.order('published_at', { ascending: false, nullsFirst: false })
    }
  } else {
    query = query.order('published_at', { ascending: false, nullsFirst: false })
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    throw new Error(error.message)
  }

  // Format the data to match ProductWithDetails
  return (data || []).map((item: any) => {
    // Find primary image
    const images = (item.product_images || []).sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
    const primaryImage = images.find((img: any) => img.is_primary) || (images.length > 0 ? images[0] : undefined)

    // Ensure inventory is treated correctly
    const inventory = Array.isArray(item.inventory) ? item.inventory[0] : item.inventory
    
    // Fix artisan / category mappings in case alias failed
    const artisan = item.artisan || (Array.isArray(item.artisan_profiles) ? item.artisan_profiles[0] : item.artisan_profiles)
    const category = item.category || (Array.isArray(item.product_categories) ? item.product_categories[0] : item.product_categories)

    return {
      ...item,
      artisan,
      category,
      primary_image: primaryImage,
      inventory,
      product_images: undefined
    } as ProductWithDetails
  })
}

export async function getProductById(id: string): Promise<ProductFullDetails> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      artisan:artisan_profiles(*),
      category:product_categories(*),
      inventory(*),
      product_images(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product details:', error)
    throw new Error(error.message)
  }

  const images = (data.product_images || []).sort((a: any, b: any) => a.sort_order - b.sort_order)
  const primaryImage = images.find((img: any) => img.is_primary) || images[0]
  const inventory = Array.isArray(data.inventory) ? data.inventory[0] : data.inventory
  const artisan = data.artisan || (Array.isArray(data.artisan_profiles) ? data.artisan_profiles[0] : data.artisan_profiles)
  const category = data.category || (Array.isArray(data.product_categories) ? data.product_categories[0] : data.product_categories)

  return {
    ...data,
    artisan,
    category,
    primary_image: primaryImage,
    images: images,
    inventory,
    product_images: undefined
  } as ProductFullDetails
}

export async function getProductsByArtisanId(artisanProfileId: string): Promise<ProductWithDetails[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:product_categories(*),
      inventory(*),
      product_images(*)
    `)
    .eq('artisan_profile_id', artisanProfileId)
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('published_at', { ascending: false, nullsFirst: false })

  if (error) {
    console.error('Error fetching artisan products:', error)
    throw new Error(error.message)
  }

  return (data || []).map((item: any) => {
    const images = (item.product_images || []).sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
    const primaryImage = images.find((img: any) => img.is_primary) || (images.length > 0 ? images[0] : undefined)
    const inventory = Array.isArray(item.inventory) ? item.inventory[0] : item.inventory
    const category = item.category || (Array.isArray(item.product_categories) ? item.product_categories[0] : item.product_categories)

    return {
      ...item,
      category,
      primary_image: primaryImage,
      inventory,
      product_images: undefined
    } as ProductWithDetails
  })
}
