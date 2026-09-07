import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY 

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('--- Testing Product Visibility ---')
  const { data: products, error: prodErr } = await supabase.from('products').select('*')
  console.log('Products fetched with anon key:', products?.length, prodErr?.message || 'OK')

  console.log('\n--- Testing Bulk Order Requests ---')
  const { data: requests, error: reqErr } = await supabase.from('bulk_order_requests').select('*')
  console.log('Bulk Requests:', requests?.length, reqErr?.message || 'OK')

  console.log('\n--- Testing Orders ---')
  const { data: orders, error: orderErr } = await supabase.from('orders').select('*')
  console.log('Orders:', orders?.length, orderErr?.message || 'OK')
}

run()
