import { supabase } from '@/lib/supabase'
import type { ArtisanProfile, ArtisanStory } from '@/types'

export async function getPublicArtisans(): Promise<ArtisanProfile[]> {
  const { data, error } = await supabase
    .from('artisan_profiles')
    .select('*')
    // Use is_published based on the actual schema
    .eq('is_published', true)
    .is('deleted_at', null)
    .order('display_name', { ascending: true })

  if (error) {
    console.error('Error fetching artisans:', error)
    throw new Error(error.message)
  }

  return data as ArtisanProfile[]
}

export async function getArtisanById(id: string): Promise<{ profile: ArtisanProfile; story: ArtisanStory | null }> {
  const { data: profileData, error: profileError } = await supabase
    .from('artisan_profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (profileError) {
    console.error('Error fetching artisan profile:', profileError)
    throw new Error(profileError.message)
  }

  const { data: storyData, error: storyError } = await supabase
    .from('artisan_stories')
    .select('*')
    .eq('artisan_profile_id', id)
    .maybeSingle()

  if (storyError) {
    console.error('Error fetching artisan story:', storyError)
    // Don't throw for story as it might not exist
  }

  return {
    profile: profileData as ArtisanProfile,
    story: storyData as ArtisanStory | null
  }
}

export async function getArtisanProfileByUserId(userId: string): Promise<ArtisanProfile | null> {
  const { data, error } = await supabase
    .from('artisan_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching artisan profile by user ID:', error)
    throw error
  }

  return data as ArtisanProfile
}
