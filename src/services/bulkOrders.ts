import { supabase } from '../lib/supabase'
import type { BulkOrderRequest, BulkOrderMessage, Order } from '../types'

// --- Bulk Order Requests ---

/**
 * Submits a new bulk order request from a business to an artisan.
 */
export async function createBulkOrderRequest(requestData: {
  business_profile_id: string
  artisan_profile_id: string
  product_id?: string
  requested_quantity: number
  requested_unit_price?: number
  required_by_date?: string
  buyer_notes?: string
}): Promise<BulkOrderRequest> {
  const { data, error } = await supabase
    .from('bulk_order_requests')
    .insert([
      {
        business_profile_id: requestData.business_profile_id,
        artisan_profile_id: requestData.artisan_profile_id,
        product_id: requestData.product_id || null,
        requested_quantity: requestData.requested_quantity,
        requested_unit_price: requestData.requested_unit_price || null,
        required_by_date: requestData.required_by_date || null,
        buyer_notes: requestData.buyer_notes || null,
        status: 'requested'
      }
    ])
    .select('*')
    .single()

  if (error) {
    console.error('Error creating bulk order request:', error)
    throw error
  }
  return data
}

/**
 * Fetches all bulk order requests made by a business.
 */
export async function getBusinessBulkRequests(businessProfileId: string): Promise<BulkOrderRequest[]> {
  const { data, error } = await supabase
    .from('bulk_order_requests')
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
    .eq('business_profile_id', businessProfileId)
    .order('requested_at', { ascending: false })

  if (error) {
    console.error('Error fetching business bulk requests:', error)
    throw error
  }
  return data
}

/**
 * Fetches all incoming bulk order requests for an artisan.
 */
export async function getArtisanBulkRequests(artisanProfileId: string): Promise<BulkOrderRequest[]> {
  const { data, error } = await supabase
    .from('bulk_order_requests')
    .select(`
      *,
      business_profile:business_profile_id (
        id,
        business_name,
        contact_person_name
      ),
      product:product_id (
        id,
        name,
        primary_image:product_images(thumbnail_path)
      )
    `)
    .eq('artisan_profile_id', artisanProfileId)
    .order('requested_at', { ascending: false })

  if (error) {
    console.error('Error fetching artisan bulk requests:', error)
    throw error
  }
  return data
}

/**
 * Fetch a single bulk request by ID
 */
export async function getBulkRequestById(id: string): Promise<BulkOrderRequest> {
  const { data, error } = await supabase
    .from('bulk_order_requests')
    .select(`
      *,
      business_profile:business_profile_id (
        id,
        business_name,
        contact_person_name
      ),
      artisan_profile:artisan_profile_id (
        id,
        display_name
      ),
      product:product_id (
        id,
        name,
        primary_image:product_images(thumbnail_path)
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching bulk request details:', error)
    throw error
  }
  return data
}

/**
 * Updates the status and/or final terms of a bulk request.
 */
export async function updateBulkRequest(
  id: string,
  updates: Partial<BulkOrderRequest>
): Promise<BulkOrderRequest> {
  const { data, error } = await supabase
    .from('bulk_order_requests')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    console.error('Error updating bulk request:', error)
    throw error
  }
  return data
}

// --- Bulk Order Messages ---

/**
 * Fetches messages for a specific bulk request thread.
 */
export async function getBulkOrderMessages(bulkRequestId: string): Promise<BulkOrderMessage[]> {
  const { data, error } = await supabase
    .from('bulk_order_messages')
    .select(`
      *,
      sender:sender_user_id (
        id,
        full_name,
        role
      )
    `)
    .eq('bulk_order_request_id', bulkRequestId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    throw error
  }
  return data
}

/**
 * Adds a new message to a bulk request thread.
 */
export async function sendBulkOrderMessage(
  bulkRequestId: string,
  senderUserId: string,
  message: string
): Promise<BulkOrderMessage> {
  const { data, error } = await supabase
    .from('bulk_order_messages')
    .insert([
      {
        bulk_order_request_id: bulkRequestId,
        sender_user_id: senderUserId,
        message: message
      }
    ])
    .select('*')
    .single()

  if (error) {
    console.error('Error sending message:', error)
    throw error
  }
  return data
}

// --- Confirmed Orders ---

/**
 * Confirms a bulk order request and generates the final Order.
 */
export async function confirmBulkOrder(bulkRequestId: string): Promise<Order> {
  // First, fetch the request to get the IDs
  const request = await getBulkRequestById(bulkRequestId)
  
  if (request.status !== 'accepted') {
    throw new Error('Bulk request must be accepted by artisan before confirmation.')
  }

  // 1. Update request status to confirmed
  await updateBulkRequest(bulkRequestId, { status: 'confirmed' })

  // 2. Insert into orders table
  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        bulk_order_request_id: bulkRequestId,
        artisan_profile_id: request.artisan_profile_id,
        business_profile_id: request.business_profile_id,
        status: 'confirmed'
      }
    ])
    .select('*')
    .single()

  if (error) {
    console.error('Error creating order:', error)
    throw error
  }
  return data
}

/**
 * Fetch orders for a business.
 */
export async function getBusinessOrders(businessProfileId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      bulk_order_request:bulk_order_request_id (
        id,
        final_quantity,
        final_unit_price,
        product:product_id (name)
      ),
      artisan_profile:artisan_profile_id (display_name)
    `)
    .eq('business_profile_id', businessProfileId)
    .order('confirmed_at', { ascending: false })

  if (error) {
    console.error('Error fetching business orders:', error)
    throw error
  }
  return data
}

/**
 * Fetch orders for an artisan.
 */
export async function getArtisanOrders(artisanProfileId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      bulk_order_request:bulk_order_request_id (
        id,
        final_quantity,
        final_unit_price,
        product:product_id (name)
      ),
      business_profile:business_profile_id (business_name, contact_person_name)
    `)
    .eq('artisan_profile_id', artisanProfileId)
    .order('confirmed_at', { ascending: false })

  if (error) {
    console.error('Error fetching artisan orders:', error)
    throw error
  }
  return data
}
