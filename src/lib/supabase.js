import { createClient } from '@supabase/supabase-js';

// Read from Vite environment or localStorage override
function getStoredConfig() {
  try {
    const saved = localStorage.getItem('supabase_config');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

export function getSupabaseCredentials() {
  const stored = getStoredConfig();
  const url = (stored && stored.url) || import.meta.env.VITE_SUPABASE_URL || '';
  const key = (stored && stored.key) || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  return { url: url.trim(), key: key.trim() };
}

let supabaseClient = null;

export function getSupabase() {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key) return null;

  if (!supabaseClient || supabaseClient.supabaseUrl !== url) {
    try {
      supabaseClient = createClient(url, key);
    } catch (err) {
      console.error("Failed to initialize Supabase client:", err);
      return null;
    }
  }
  return supabaseClient;
}

export function isSupabaseConnected() {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && url.includes('supabase.co'));
}

export function saveSupabaseConfig(url, key) {
  localStorage.setItem('supabase_config', JSON.stringify({ url: url.trim(), key: key.trim() }));
  supabaseClient = null; // force re-creation
}

export function clearSupabaseConfig() {
  localStorage.removeItem('supabase_config');
  supabaseClient = null;
}

// Fetch database stats (total rows collected)
export async function fetchDatabaseStats() {
  const client = getSupabase();
  if (!client) return null;

  try {
    const [profilesRes, doubtsRes, answersRes, notesRes] = await Promise.all([
      client.from('profiles').select('*', { count: 'exact', head: true }),
      client.from('doubts').select('*', { count: 'exact', head: true }),
      client.from('answers').select('*', { count: 'exact', head: true }),
      client.from('notes').select('*', { count: 'exact', head: true })
    ]);

    return {
      connected: true,
      profilesCount: profilesRes.count ?? 0,
      doubtsCount: doubtsRes.count ?? 0,
      answersCount: answersRes.count ?? 0,
      notesCount: notesRes.count ?? 0,
      totalRows: (profilesRes.count ?? 0) + (doubtsRes.count ?? 0) + (answersRes.count ?? 0) + (notesRes.count ?? 0)
    };
  } catch (err) {
    console.warn("Could not fetch Supabase counts (tables might not be created yet):", err);
    return {
      connected: true,
      error: "Tables not created yet in SQL editor",
      profilesCount: 0,
      doubtsCount: 0,
      answersCount: 0,
      notesCount: 0,
      totalRows: 0
    };
  }
}
