import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env manually
const envPath = path.resolve(process.cwd(), '.env');
const envFile = fs.readFileSync(envPath, 'utf-8');
const env: Record<string, string> = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseAnonKey = env['VITE_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const USERS = [
  { email: 'customer@test.com', password: 'password123', role: 'customer', name: 'Test Customer' },
  { email: 'artisan@test.com', password: 'password123', role: 'artisan', name: 'Ravi Weaver' },
  { email: 'artisan2@test.com', password: 'password123', role: 'artisan', name: 'Anita Potter' },
  { email: 'business@test.com', password: 'password123', role: 'business', name: 'Global Boutiques Ltd' },
];

async function seed() {
  const userIds: Record<string, string> = {};

  // 1. Authenticate and get IDs
  console.log('--- 1. Authenticating Users ---');
  for (const u of USERS) {
    let { data, error } = await supabase.auth.signInWithPassword({ email: u.email, password: u.password });
    if (error) {
       console.log(`Failed to login ${u.email}, attempting signup...`);
       const res = await supabase.auth.signUp({ email: u.email, password: u.password, options: { data: { full_name: u.name, role: u.role } } });
       if (res.error) throw new Error(`Signup failed for ${u.email}: ${res.error.message}`);
       data = res.data as any;
    }
    userIds[u.email] = data.user!.id;
    console.log(`User ${u.email} -> ${userIds[u.email]}`);
    
    // Attempt to upsert the profile via trigger might already happen, but let's ensure the role is set.
    // Note: updating profiles table directly requires RLS privileges or triggers. Let's see if we can read it.
  }

  // 2. Insert Artisan Profiles
  console.log('\n--- 2. Creating Artisan Profiles ---');
  // Login as artisan 1
  await supabase.auth.signInWithPassword({ email: 'artisan@test.com', password: 'password123' });
  const artisan1Profile = {
    user_id: userIds['artisan@test.com'],
    display_name: 'Varanasi Silk Works',
    craft_summary: 'Weavers of authentic Banarasi silk sarees and textiles.',
    location_city: 'Varanasi',
    location_state: 'Uttar Pradesh',
    profile_photo_path: 'https://images.unsplash.com/photo-1584447128309-b66b7a4d1b63?w=800&q=80',
    is_published: true
  };
  const { data: a1, error: a1Err } = await supabase.from('artisan_profiles').upsert(artisan1Profile, { onConflict: 'user_id' }).select().single();
  if (a1Err) console.error('A1 Err:', a1Err);

  // Login as artisan 2
  await supabase.auth.signInWithPassword({ email: 'artisan2@test.com', password: 'password123' });
  const artisan2Profile = {
    user_id: userIds['artisan2@test.com'],
    display_name: 'Jaipur Blue Pottery',
    craft_summary: 'Traditional Jaipur blue pottery artisans.',
    location_city: 'Jaipur',
    location_state: 'Rajasthan',
    profile_photo_path: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',
    is_published: true
  };
  const { data: a2, error: a2Err } = await supabase.from('artisan_profiles').upsert(artisan2Profile, { onConflict: 'user_id' }).select().single();
  if (a2Err) console.error('A2 Err:', a2Err);

  const a1Id = a1?.id;
  const a2Id = a2?.id;

  if (!a1Id || !a2Id) {
    console.error('Failed to create artisan profiles, aborting.');
    return;
  }

  // 3. Products
  console.log('\n--- 3. Creating Products ---');
  await supabase.auth.signInWithPassword({ email: 'artisan@test.com', password: 'password123' });
  
  // Need a category. Let's find one.
  let { data: cats } = await supabase.from('product_categories').select('*').limit(1);
  let categoryId = cats && cats.length > 0 ? cats[0].id : null;

  if (!categoryId) {
    console.log('No product_categories found. Creating one...');
    const { data: newCat } = await supabase.from('product_categories').insert({
      name: 'Textiles',
      slug: 'textiles',
      is_active: true
    }).select().single();
    categoryId = newCat?.id;
  }
  
  console.log('Using categoryId:', categoryId);

  const { data: p1, error: p1Err } = await supabase.from('products').insert({
    artisan_profile_id: a1Id,
    category_id: categoryId,
    name: 'Banarasi Silk Saree',
    description: 'Authentic handwoven Banarasi silk saree with intricate zari work.',
    material: 'Pure Silk, Zari',
    price: 15000,
    currency: 'INR',
    dimensions: '6.5 meters',
    weight: 0.8,
    primary_colour: 'Red',
    craft_type: 'Handloom Weaving',
    status: 'published',
    published_at: new Date().toISOString()
  }).select().single();
  if (p1Err) console.error('P1 Err:', p1Err);
  const p1Id = p1?.id;

  await supabase.auth.signInWithPassword({ email: 'artisan2@test.com', password: 'password123' });
  const { data: p2, error: p2Err } = await supabase.from('products').insert({
    artisan_profile_id: a2Id,
    category_id: categoryId,
    name: 'Blue Pottery Vase',
    description: 'Traditional Jaipur blue pottery vase decorated with floral motifs.',
    material: 'Quartz powder, glass, multani mitti',
    price: 2500,
    currency: 'INR',
    dimensions: '10x10x20 cm',
    weight: 1.2,
    primary_colour: 'Blue',
    craft_type: 'Blue Pottery',
    status: 'published',
    published_at: new Date().toISOString()
  }).select().single();
  if (p2Err) console.error('P2 Err:', p2Err);
  const p2Id = p2?.id;

  if (!p1Id || !p2Id) {
    console.error('Failed to create products, aborting.');
    return;
  }

  // Insert Images
  await supabase.auth.signInWithPassword({ email: 'artisan@test.com', password: 'password123' });
  await supabase.from('product_images').insert({
    product_id: p1Id,
    original_path: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
    is_primary: true,
    sort_order: 1
  }); 

  await supabase.auth.signInWithPassword({ email: 'artisan2@test.com', password: 'password123' });
  await supabase.from('product_images').insert({
    product_id: p2Id,
    original_path: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',
    is_primary: true,
    sort_order: 1
  });

  // 4. Business Profile
  console.log('\n--- 4. Creating Business Profile ---');
  await supabase.auth.signInWithPassword({ email: 'business@test.com', password: 'password123' });
  const { data: biz, error: bizErr } = await supabase.from('business_profiles').upsert({
    user_id: userIds['business@test.com'],
    business_name: 'Global Boutiques Ltd',
    contact_person_name: 'Alice Manager',
    industry: 'Retail',
    location_city: 'Mumbai',
    is_active: true
  }, { onConflict: 'user_id' }).select().single();
  if (bizErr) console.error('Biz Err:', bizErr);
  const bizId = biz?.id;

  // 5. Customer Enquiry
  console.log('\n--- 5. Creating Customer Enquiries ---');
  await supabase.auth.signInWithPassword({ email: 'customer@test.com', password: 'password123' });
  await supabase.from('customer_enquiries').insert({
    customer_id: userIds['customer@test.com'],
    artisan_profile_id: a1Id,
    product_id: p1Id,
    subject: 'Bulk order possibility?',
    message: 'I love this saree. Do you take custom orders for weddings?',
    status: 'open'
  });

  // Check Profiles table
  console.log('\n--- Checking Profiles Table ---');
  await supabase.auth.signInWithPassword({ email: 'business@test.com', password: 'password123' });
  const { data: profiles } = await supabase.from('profiles').select('*').in('id', Object.values(userIds));
  console.log('Profiles:', profiles);

  // 6. Bulk Request
  console.log('\n--- 6. Creating B2B Bulk Requests ---');
  console.log(`bizId: ${bizId}, a2Id: ${a2Id}, p2Id: ${p2Id}`);
  
  if (!bizId || !a2Id || !p2Id) {
    console.error('Missing IDs for bulk request!');
    return;
  }

  const { data: req, error: reqErr } = await supabase.from('bulk_order_requests').insert({
    business_profile_id: bizId,
    artisan_profile_id: a2Id,
    product_id: p2Id,
    requested_quantity: 50,
    requested_unit_price: 2000,
    buyer_notes: 'Need 50 vases for a corporate event.',
    status: 'requested'
  }).select().single();
  if (reqErr) console.error('Req Err:', reqErr);
  const reqId = req?.id;

  if (reqId) {
    // 7. Messages
    console.log('\n--- 7. Adding Messages ---');
    const { error: msgErr } = await supabase.from('bulk_order_messages').insert({
      bulk_order_request_id: reqId,
      sender_user_id: userIds['business@test.com'],
      message: 'Hi, can we negotiate the price to 2000 INR per unit for an order of 50?'
    });
    if (msgErr) console.error('Msg Err:', msgErr);

    // Also accept the request so we can create an order
    await supabase.auth.signInWithPassword({ email: 'artisan2@test.com', password: 'password123' });
    const { error: accErr } = await supabase.from('bulk_order_requests').update({
      status: 'accepted',
      final_quantity: 50,
      final_unit_price: 2000
    }).eq('id', reqId);
    if (accErr) console.error('Accept Err:', accErr);

    // Business confirms the order
    await supabase.auth.signInWithPassword({ email: 'business@test.com', password: 'password123' });
    const { error: confErr } = await supabase.from('bulk_order_requests').update({
      status: 'confirmed'
    }).eq('id', reqId);
    if (confErr) console.error('Conf Err:', confErr);

    const { error: ordErr } = await supabase.from('orders').insert({
      bulk_order_request_id: reqId,
      artisan_profile_id: a2Id,
      business_profile_id: bizId,
      status: 'confirmed'
    });
    if (ordErr) console.error('Ord Err:', ordErr);
  }

  // 8. Inventory
  console.log('\n--- 8. Setting Inventory ---');
  await supabase.auth.signInWithPassword({ email: 'artisan@test.com', password: 'password123' });
  await supabase.from('product_inventory').insert({
    product_id: p1Id,
    stock_quantity: 15,
    low_stock_threshold: 5
  });

  await supabase.auth.signInWithPassword({ email: 'artisan2@test.com', password: 'password123' });
  await supabase.from('product_inventory').insert({
    product_id: p2Id,
    stock_quantity: 2,
    low_stock_threshold: 5 // Low stock
  });

  console.log('\n--- Done Seeding! ---');
}

seed().catch(console.error);
