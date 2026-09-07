import { supabase } from '../lib/supabase'
import type { CustomerEnquiry } from '../types'

/**
 * Creates a new customer enquiry for a product and artisan.
 */
export async function createEnquiry(enquiryData: {
  customer_id: string
  artisan_profile_id: string
  product_id?: string
  subject: string
  message: string
}): Promise<CustomerEnquiry> {
  const { data, error } = await supabase
    .from('customer_enquiries')
    .insert([
      {
        customer_id: enquiryData.customer_id,
        artisan_profile_id: enquiryData.artisan_profile_id,
        product_id: enquiryData.product_id || null,
        subject: enquiryData.subject,
        message: enquiryData.message,
        status: 'open'
      }
    ])
    .select('*')
    .single()

  if (error) {
    console.error('Error creating enquiry:', error)
    throw error
  }
  return data
}

/**
 * Fetches all enquiries made by a specific customer.
 */
export async function getCustomerEnquiries(customerId: string): Promise<CustomerEnquiry[]> {
  const { data, error } = await supabase
    .from('customer_enquiries')
    .select(`
      *,
      artisan_profile:artisan_profile_id (
        id,
        display_name
      ),
      product:product_id (
        id,
        name
      )
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching customer enquiries:', error)
    throw error
  }
  return data
}

/**
 * Fetches all enquiries directed to a specific artisan.
 */
export async function getArtisanEnquiries(artisanProfileId: string): Promise<CustomerEnquiry[]> {
  const { data, error } = await supabase
    .from('customer_enquiries')
    .select(`
      *,
      customer:customer_id (
        id,
        full_name,
        avatar_path
      ),
      product:product_id (
        id,
        name,
        primary_image:product_images(thumbnail_path)
      )
    `)
    .eq('artisan_profile_id', artisanProfileId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching artisan enquiries:', error)
    throw error
  }
  return data
}

/**
 * Allows an artisan to respond to an enquiry and optionally change status.
 */
export async function respondToEnquiry(
  enquiryId: string,
  responseMessage: string,
  newStatus: 'open' | 'responded' | 'closed' = 'responded'
): Promise<CustomerEnquiry> {
  const { data, error } = await supabase
    .from('customer_enquiries')
    .update({
      artisan_response: responseMessage,
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', enquiryId)
    .select('*')
    .single()

  if (error) {
    console.error('Error responding to enquiry:', error)
    throw error
  }
  return data
}

/**
 * Update enquiry status directly (e.g. customer closing it)
 */
export async function updateEnquiryStatus(
  enquiryId: string,
  newStatus: 'open' | 'responded' | 'closed'
): Promise<CustomerEnquiry> {
  const { data, error } = await supabase
    .from('customer_enquiries')
    .update({
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', enquiryId)
    .select('*')
    .single()

  if (error) {
    console.error('Error updating enquiry status:', error)
    throw error
  }
  return data
}
