import { createClient } from '@supabase/supabase-js';

// These should be set in .env
// VITE_SUPABASE_URL="your-supabase-url"
// VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"

// Safer initialization without Proxy
export const supabase = (() => {
  // Safe environment variable access
  const getEnvVar = (key: string) => {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
    return '';
  };

  const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || 'https://placeholder-url.supabase.co';
  const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || 'placeholder-key';

  return createClient(supabaseUrl, supabaseAnonKey);
})();
