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
    // Use localStorage by default for persistence
    storage: localStorage,
    storageKey: 'supabase.auth.token',
    debug: false,
    // Set session lifetime (30 days for "Remember Me")
    // This works with refresh tokens automatically
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Enhanced auth state change listener for debugging
if (import.meta.env.DEV) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event !== 'INITIAL_SESSION' && event !== 'TOKEN_REFRESHED') {
      console.log('Supabase Auth Event:', event, session?.user?.email);
      
      // Log storage info for debugging
      if (event === 'SIGNED_IN') {
        const hasLocalStorage = !!localStorage.getItem('supabase.auth.token');
        const hasSessionStorage = !!sessionStorage.getItem('supabase.auth.token');
        console.log('Session Storage:', {
          localStorage: hasLocalStorage,
          sessionStorage: hasSessionStorage
        });
      }
    }
  });
}

// Helper function to manually set session persistence
export const setSessionPersistence = async (useLocalStorage: boolean) => {
  if (useLocalStorage) {
    // Move session to localStorage for persistence
    const sessionData = sessionStorage.getItem('supabase.auth.token');
    if (sessionData) {
      localStorage.setItem('supabase.auth.token', sessionData);
      sessionStorage.removeItem('supabase.auth.token');
    }
  } else {
    // Move session to sessionStorage for session-only
    const sessionData = localStorage.getItem('supabase.auth.token');
    if (sessionData) {
      sessionStorage.setItem('supabase.auth.token', sessionData);
      localStorage.removeItem('supabase.auth.token');
    }
  }
};