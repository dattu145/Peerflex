import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: localStorage,
    storageKey: 'supabase.auth.token',
    debug: false, // Disable debug logs to reduce console noise
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Only log important auth events in development
if (import.meta.env.DEV) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event !== 'INITIAL_SESSION' && event !== 'TOKEN_REFRESHED') {
      console.log('Supabase Auth Event:', event, session?.user?.email);
    }
  });
}