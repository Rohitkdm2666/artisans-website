import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nijhfuygttoakcykzedf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZVMiLCJyZWYiOiJuaWpoZnV5Z3R0b2FrY3lremVkZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzg4Njk0NzM0LCJleHAiOjIxMDQyNzA3MzR9.YGxj7SZt1-hNVLlBNOHMoO0eojn6pUJsCB_ugybXKf8'
);

async function check() {
  const { data, error } = await supabase
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
    .limit(1);

  if (error) {
    console.error('Error:', error);
    return;
  }
  
  const product = data[0];
  console.log('ID type:', typeof product.id, product.id);
  console.log('Name type:', typeof product.name, product.name);
  console.log('Price type:', typeof product.price, product.price);
  console.log('Currency type:', typeof product.currency, product.currency);
  
  if (product.category) {
    console.log('Category name type:', typeof product.category.name, product.category.name);
    console.log('Category object?:', Array.isArray(product.category) ? 'Array' : 'Object');
  } else {
    console.log('product.category is missing');
  }

  if (product.artisan) {
    console.log('Artisan name type:', typeof product.artisan.display_name, product.artisan.display_name);
    console.log('Artisan object?:', Array.isArray(product.artisan) ? 'Array' : 'Object');
  } else {
    console.log('product.artisan is missing');
  }
}

check();
