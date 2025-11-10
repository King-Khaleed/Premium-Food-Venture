
import { createClient } from '@supabase/supabase-js';

// This client is intended for client-side (browser) use ONLY.
// It uses the ANON_KEY, which is safe to expose in a browser context.
export const createSupabaseAnonClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL or Anon Key is missing in environment variables.');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};
