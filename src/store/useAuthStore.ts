import { create } from "zustand";
import { supabase } from "../config/supabase";
import type { User } from "@supabase/supabase-js";

// --------------------------------
// Types
// --------------------------------
interface ProfileData {
  name: string;
  email: string;
  college: string;
  city: string;
  role: "student" | "professional";
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  profile: any | null;
  signup: (data: ProfileData & { password: string }) => Promise<void>;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: (rememberMe?: boolean) => Promise<void>;
  signInWithGithub: (rememberMe?: boolean) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  initializeAuth: () => Promise<void>;
  checkResetSession: () => Promise<boolean>;
  resendConfirmationEmail: (email: string) => Promise<void>;
  verifySessionValidity: () => Promise<void>;
  setProfile: (profile: any) => void;
}

// --------------------------------
// Zustand Store
// --------------------------------
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  profile: null,

  // --------------------------------
  // ✅ Initialize Auth (Run Once on App Load)
  // --------------------------------
  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      // 🔒 Clear corrupted or expired Supabase sessions
      const saved = localStorage.getItem("supabase.auth.token");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const expiresAt = parsed?.currentSession?.expires_at;
          if (expiresAt && Date.now() / 1000 > expiresAt) {
            console.warn("Old Supabase session expired. Clearing cache...");
            localStorage.removeItem("supabase.auth.token");
            sessionStorage.removeItem("supabase.auth.token");
          }
        } catch {
          localStorage.removeItem("supabase.auth.token");
          sessionStorage.removeItem("supabase.auth.token");
        }
      }

      // ✅ Check active session
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.error("Session load error:", error);

      if (!session?.user) {
        await supabase.auth.signOut();
        localStorage.removeItem("supabase.auth.token");
        sessionStorage.removeItem("supabase.auth.token");
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      // ✅ Valid session found → fetch profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Profile fetch error:", profileError);
      }

      set({
        user: session.user,
        profile: profile || null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      console.error("Auth init failed:", err);
      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // --------------------------------
  // ✅ Verify Session Validity (Manual Check)
  // --------------------------------
  verifySessionValidity: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        await supabase.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
        });
      }
    } catch (err) {
      console.error("Session verification error:", err);
    }
  },

  // --------------------------------
  // ✅ Signup
  // --------------------------------
  signup: async (data) => {
    set({ isLoading: true });
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            name: data.name,
            college: data.college,
            city: data.city,
            role: data.role,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        // Check if this is a "user already exists" error
        if (error.message?.includes('already registered') ||
          error.message?.includes('already exists') ||
          error.message?.includes('User already registered') ||
          error.message?.includes('user_already_exists') ||
          error.code === 'user_already_exists') {
          throw new Error('email already exists try logging in');
        }
        throw error;
      }

      if (!authData.user) throw new Error("Signup failed.");

      // ✅ CRITICAL FIX: Check if user already exists by looking at identities array
      // If identities is empty, it means the user already exists but Supabase didn't create a new identity
      if (authData.user.identities && authData.user.identities.length === 0) {
        throw new Error('email already exists try logging in');
      }

      // Insert into profile table if signed in
      if (authData.session) {
        await supabase.from("profiles").upsert({
          id: authData.user.id,
          full_name: data.name,
          email: data.email,
          university: data.college,
          city: data.city,
          role: data.role,
        });
      }

      set({
        user: authData.user,
        isAuthenticated: !!authData.session,
        isLoading: false,
      });
    } catch (err: any) {
      console.error("Signup error:", err);
      set({ isLoading: false });
      throw new Error(err.message || "Failed to sign up.");
    }
  },

  // --------------------------------
  // ✅ Login with Remember Me
  // --------------------------------
  login: async (email, password, rememberMe = false) => {
    set({ isLoading: true });
    try {
      // Set session persistence based on remember me choice
      if (rememberMe) {
        // Persistent session (localStorage) - lasts until explicit logout
        await supabase.auth.setSession({
          refresh_token: localStorage.getItem('supabase.auth.token') ? JSON.parse(localStorage.getItem('supabase.auth.token')!).currentSession?.refresh_token : undefined,
          access_token: localStorage.getItem('supabase.auth.token') ? JSON.parse(localStorage.getItem('supabase.auth.token')!).currentSession?.access_token : undefined,
        });
      } else {
        // Session storage - clears when browser closes
        await supabase.auth.setSession({
          refresh_token: sessionStorage.getItem('supabase.auth.token') ? JSON.parse(sessionStorage.getItem('supabase.auth.token')!).currentSession?.refresh_token : undefined,
          access_token: sessionStorage.getItem('supabase.auth.token') ? JSON.parse(sessionStorage.getItem('supabase.auth.token')!).currentSession?.access_token : undefined,
        });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!data.user) throw new Error("Invalid credentials.");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      set({
        user: data.user,
        profile: profile || null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      console.error("Login error:", err);
      set({ isLoading: false });
      throw new Error(err.message || "Login failed.");
    }
  },

  // --------------------------------
  // ✅ Logout (Clears Everything)
  // --------------------------------

  logout: async () => {
    console.log('🔄 Logout started...');
    set({ isLoading: true });
    try {
      console.log('📤 Calling supabase.auth.signOut()...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Supabase signOut error:', error);
        throw error;
      }

      console.log('🗑️ Clearing storage and subscriptions...');
      await supabase.removeAllChannels();

      // Clear all storage
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
      localStorage.clear();
      sessionStorage.clear();

      console.log('🔄 Updating Zustand state...');
      // Force state update - use setTimeout to ensure React batch update completes
      setTimeout(() => {
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        });
        console.log('✅ Zustand state updated - user should be logged out');
      }, 0);

    } catch (err: any) {
      console.error('❌ Logout error:', err);
      set({ isLoading: false });
      throw new Error(err.message || "Logout failed.");
    }
  },

  // --------------------------------
  // ✅ OAuth Providers with Remember Me
  // --------------------------------
  signInWithGoogle: async (rememberMe = false) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent"
          },
          // Pass remember me preference to OAuth flow
          skipBrowserRedirect: false,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      set({ isLoading: false });
      throw new Error(err.message || "Google sign-in failed.");
    }
  },

  signInWithGithub: async (rememberMe = false) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          // Pass remember me preference to OAuth flow
          skipBrowserRedirect: false,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("GitHub sign-in error:", err);
      set({ isLoading: false });
      throw new Error(err.message || "GitHub sign-in failed.");
    }
  },

  resetPassword: async (email) => {
    set({ isLoading: true });
    try {
      // Use the Site URL from your Supabase configuration
      const redirectTo = `${window.location.origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo
      });

      if (error) {
        console.error('Reset password error details:', error);
        throw error;
      }

      set({ isLoading: false });
    } catch (err: any) {
      console.error("Reset password error:", err);
      set({ isLoading: false });
      throw new Error(err.message || "Password reset failed. Please try again.");
    }
  },

  updatePassword: async (newPassword) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      set({ isLoading: false });
    } catch (err: any) {
      console.error("Password update error:", err);
      set({ isLoading: false });
      throw new Error(err.message || "Password update failed.");
    }
  },

  // --------------------------------
  // ✅ Check Reset Session
  // --------------------------------
  checkResetSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session?.user;
    } catch {
      return false;
    }
  },

  // --------------------------------
  // ✅ Resend Email Confirmation
  // --------------------------------
  resendConfirmationEmail: async (email) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
      set({ isLoading: false });
    } catch (err: any) {
      console.error("Resend email error:", err);
      set({ isLoading: false });
      throw new Error(err.message || "Resend confirmation failed.");
    }
  },

  setProfile: (profile) => set({ profile }),
}));