import { supabase } from '@/lib/supabase'
import type { ProductCategory } from '@/types'

export async function getActiveCategories(): Promise<ProductCategory[]> {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    throw new Error(error.message)
  }

  return data as ProductCategory[]
}
