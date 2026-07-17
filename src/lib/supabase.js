import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable email confirmation in development
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    
    // Optional: Custom flow for development
    flowType: 'pkce'
  }
});
