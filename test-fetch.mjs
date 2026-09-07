const SUPABASE_URL = 'https://nijhfuygttoakcykzedf.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZVMiLCJyZWYiOiJuaWpoZnV5Z3R0b2FrY3lremVkZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzg4Njk0NzM0LCJleHAiOjIxMDQyNzA3MzR9.YGxj7SZt1-hNVLlBNOHMoO0eojn6pUJsCB_ugybXKf8';

async function test() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*,artisan:artisan_profiles(*),category:product_categories(*),inventory(*),product_images(*)&status=eq.published&deleted_at=is.null`, {
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`
    }
  });
  
  if (!res.ok) {
    console.error(await res.text());
    return;
  }
  
  const data = await res.json();
  const product = data[0];
  console.log('ID:', typeof product.id, product.id);
  console.log('Name:', typeof product.name, product.name);
  console.log('Price:', typeof product.price, product.price);
  console.log('Category:', typeof product.category, Array.isArray(product.category) ? 'Array' : 'Object');
  console.log('Images:', typeof product.product_images, Array.isArray(product.product_images) ? 'Array' : 'Object');
}
test();
