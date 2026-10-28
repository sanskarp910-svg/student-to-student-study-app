import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from Vite environment variables with project fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://frndebscouqiuxnoqnbp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZybmRlYnNjb3VxaXV4bm9xbmJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMTI4NjUsImV4cCI6MjEwODc4ODg2NX0.BKAIp6ET4QZWemrLCaeJCPWtOR7t-8QA38SV94dnrMI';

export const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const isSupabaseConnected = () => isConfigured;

export const getSupabaseCredentials = () => ({
  url: supabaseUrl,
  key: supabaseAnonKey
});

export const saveSupabaseConfig = (url, key) => {
  return true;
};

export const clearSupabaseConfig = () => {
  return true;
};

export const fetchDatabaseStats = async () => {
  if (!supabase) return { profiles: 0, doubts: 0, answers: 0, notes: 0 };
  try {
    const [p, d, a, n] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('doubts').select('id', { count: 'exact', head: true }),
      supabase.from('answers').select('id', { count: 'exact', head: true }),
      supabase.from('notes').select('id', { count: 'exact', head: true })
    ]);
    return {
      profiles: p.count || 0,
      doubts: d.count || 0,
      answers: a.count || 0,
      notes: n.count || 0
    };
  } catch (err) {
    console.warn("fetchDatabaseStats:", err);
    return { profiles: 0, doubts: 0, answers: 0, notes: 0 };
  }
};

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// ==========================================
// 100% CLOUD DATABASE SERVICES
// ==========================================

export const cloudAuth = {
  // Sign up new student on Cloud
  async signUp(email, password, studentData) {
    if (!supabase) throw new Error("Supabase is not configured yet. Please provide your Supabase URL & Anon Key.");
    
    // 1. Create Cloud Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: studentData.name,
          uid: studentData.uid,
          college: studentData.college,
          course: studentData.course,
          semester: studentData.semester,
          subjects: studentData.subjects
        }
      }
    });

    if (authError) throw authError;

    // 2. Insert into cloud profiles table
    if (authData.user) {
      const profile = {
        id: authData.user.id,
        name: studentData.name,
        uid: studentData.uid,
        college: studentData.college,
        course: studentData.course,
        semester: studentData.semester,
        subjects: studentData.subjects || [],
        points: 100,
        avatar: studentData.avatar || `https://images.unsplash.com/photo-1534528741775?auto=format&fit=crop&w=200&q=80`
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([profile]);

      if (profileError) {
        console.warn("Profile table insert warning:", profileError.message);
      }
      return { user: authData.user, profile };
    }
    return authData;
  },

  // Sign in existing student on Cloud
  async signIn(email, password) {
    if (!supabase) throw new Error("Supabase is not configured yet. Please provide your Supabase URL & Anon Key.");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    
    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return { session: data.session, user: data.user, profile };
  },

  // Sign out from Cloud
  async signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  },

  // Get active session from Cloud
  async getSession() {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  }
};

// Cloud Doubts Service
export const cloudDoubts = {
  async fetchAll() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('doubts')
      .select('*, answers(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(doubt) {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from('doubts')
      .insert([doubt])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addAnswer(answer) {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from('answers')
      .insert([answer])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Cloud Notes Service
export const cloudNotes = {
  async fetchAll() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(note) {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from('notes')
      .insert([note])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Cloud Study Groups Service
export const cloudGroups = {
  async fetchAll() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('study_groups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
