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

async function testStorage() {
  console.log('Testing storage buckets...');
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Error listing buckets:', error);
  } else {
    console.log('Buckets:', data.map(b => b.name));
  }
}

async function tryCreateArtisan2() {
  console.log('Attempting to log in as artisan2@test.com...');
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'artisan2@test.com',
    password: 'password123'
  });

  if (loginError) {
    console.log('Login failed, attempting sign up...');
    const { data, error } = await supabase.auth.signUp({
      email: 'artisan2@test.com',
      password: 'password123',
      options: {
        data: {
          full_name: 'Test Artisan 2',
          role: 'artisan'
        }
      }
    });
    if (error) {
      console.error('Error signing up artisan2:', error.message);
    } else {
      console.log('Successfully signed up artisan2! ID:', data.user?.id);
    }
  } else {
    console.log('Already logged in as artisan2! ID:', loginData.user?.id);
  }
}

async function run() {
  await testStorage();
  await tryCreateArtisan2();
}

run();
