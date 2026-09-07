// =====================================================
// DOMAIN TYPES — Indian Artisan Marketplace
// Phase 3: Supabase Real Data Types
// =====================================================

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

// --- User / Auth ---
export interface Profile {
  id: string
  role: 'customer' | 'artisan' | 'business' | 'admin'
  full_name: string | null
  phone: string | null
  preferred_language: string | null
  avatar_path: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// --- Artisan ---
export interface ArtisanProfile {
  id: string
  user_id: string
  display_name: string
  location_city: string | null
  location_state: string | null
  location_country: string | null
  craft_summary: string | null
  experience_years: number | null
  profile_photo_path: string | null
  is_published: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ArtisanStory {
  id: string
  artisan_profile_id: string
  source_text: string | null
  generated_story: string | null
  approved_story: string | null
  source_language: string
  is_published: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// --- Catalog ---
export interface ProductCategory {
  id: string
  name: string
  slug: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  artisan_profile_id: string
  category_id: string | null
  name: string
  description: string | null
  material: string | null
  dimensions: string | null
  primary_colour: string | null
  secondary_colour: string | null
  weight: number | null
  craft_type: string | null
  tags: string[] | null
  additional_notes: string | null
  price: number
  currency: string
  status: 'published' | 'draft' | 'archived'
  published_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ProductImage {
  id: string
  product_id: string
  original_path: string | null
  enhanced_path: string | null
  thumbnail_path: string | null
  alt_text: string | null
  is_primary: boolean
  sort_order: number
  processing_status: string | null
  created_at: string
  updated_at: string
}

export interface Inventory {
  id: string
  product_id: string
  quantity_on_hand: number
  reserved_quantity: number
  low_stock_threshold: number
  updated_at: string
}

// --- Business Profile ---
export interface BusinessProfile {
  id: string
  user_id: string
  business_name: string
  contact_person_name: string | null
  contact_email: string | null
  contact_phone: string | null
  industry: string | null
  registration_number: string | null
  location_city: string | null
  location_state: string | null
  location_country: string | null
  business_description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// --- Customer Enquiry ---
export interface CustomerEnquiry {
  id: string
  customer_id: string
  artisan_profile_id: string
  product_id: string | null
  subject: string | null
  message: string
  artisan_response: string | null
  status: 'open' | 'responded' | 'closed'
  created_at: string
  updated_at: string
}

// --- Bulk Order Requests ---
export interface BulkOrderRequest {
  id: string
  business_profile_id: string
  artisan_profile_id: string
  product_id: string | null
  requested_quantity: number
  requested_unit_price: number | null
  required_by_date: string | null
  buyer_notes: string | null
  artisan_notes: string | null
  final_quantity: number | null
  final_unit_price: number | null
  final_requirements: string | null
  status: 'requested' | 'under_review' | 'accepted' | 'rejected' | 'confirmed' | 'cancelled'
  requested_at: string
  updated_at: string
}

export interface BulkOrderMessage {
  id: string
  bulk_order_request_id: string
  sender_user_id: string
  message: string
  created_at: string
}

// --- Confirmed Orders ---
export interface Order {
  id: string
  bulk_order_request_id: string
  artisan_profile_id: string
  business_profile_id: string
  status: 'confirmed' | 'cancelled'
  confirmed_at: string
  updated_at: string
}

// --- Composite Types for UI ---
export interface ProductWithDetails extends Product {
  artisan?: ArtisanProfile
  category?: ProductCategory
  primary_image?: ProductImage
  inventory?: Inventory
}

export interface ProductFullDetails extends ProductWithDetails {
  images?: ProductImage[]
}

// --- UI helper types ---
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
}
