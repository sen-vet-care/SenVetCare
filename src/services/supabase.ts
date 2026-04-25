import { createClient } from '@supabase/supabase-js';

// These should be set in .env
// VITE_SUPABASE_URL="your-supabase-url"
// VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"

// Safe environment variable access for both Vite client and Node server
const getEnvVar = (key: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
