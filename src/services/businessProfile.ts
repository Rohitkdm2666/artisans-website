import { supabase } from '../lib/supabase'
import type { BusinessProfile } from '../types'

/**
 * Fetches the business profile for a specific user.
 */
export async function getBusinessProfile(userId: string): Promise<BusinessProfile | null> {
  const { data, error } = await supabase
    .from('business_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching business profile:', error)
    throw error
  }
  return data
}

/**
 * Creates or updates a business profile for a user.
 */
export async function upsertBusinessProfile(profileData: Partial<BusinessProfile> & { user_id: string }): Promise<BusinessProfile> {
  const { data, error } = await supabase
    .from('business_profiles')
    .upsert({
      ...profileData,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
    .select('*')
    .single()

  if (error) {
    console.error('Error upserting business profile:', error)
    throw error
  }
  return data
}
