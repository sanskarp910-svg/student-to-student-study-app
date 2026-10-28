// Supabase Client Helper
// To connect to a live Supabase backend:
// 1. Run `npm install @supabase/supabase-js`
// 2. Set your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in `.env`

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let supabaseClient = null;

export async function getSupabase() {
  if (!isSupabaseConfigured) return null;
  if (!supabaseClient) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    } catch {
      console.warn("Supabase package not installed yet. Using local state.");
    }
  }
  return supabaseClient;
}
