import { create } from 'zustand';
import { supabase } from '../config/supabase';
import type { User } from '@supabase/supabase-js';

interface ProfileData {
  name: string;
  email: string;
  college: string;
  city: string;
  role: 'student' | 'professional';
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  profile: any | null;
  signup: (data: ProfileData & { password: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  initializeAuth: () => Promise<void>;
  checkResetSession: () => Promise<boolean>;
  resendConfirmationEmail: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  profile: null,

  initializeAuth: async () => {
    try {
      set({ isLoading: true });

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) console.error('Session error:', sessionError);

      if (session?.user) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Profile fetch error:', profileError);
          }

          set({
            user: session.user,
            profile: profile || null,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          console.error('Error loading profile:', error);
          set({
            user: session.user,
            isAuthenticated: true,
            isLoading: false
          });
        }
      } else {
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false
        });
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event);
        switch (event) {
          case 'SIGNED_IN':
            if (session?.user) {
              try {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .single();

                set({
                  user: session.user,
                  profile,
                  isAuthenticated: true,
                  isLoading: false
                });
              } catch (error) {
                console.error('Error loading profile after sign in:', error);
                set({
                  user: session.user,
                  isAuthenticated: true,
                  isLoading: false
                });
              }
            }
            break;

          case 'SIGNED_OUT':
            set({
              user: null,
              profile: null,
              isAuthenticated: false,
              isLoading: false
            });
            break;

          case 'USER_UPDATED':
            if (session?.user) set({ user: session.user });
            break;

          case 'PASSWORD_RECOVERY':
            set({
              user: session?.user || null,
              isAuthenticated: !!session?.user,
              isLoading: false
            });
            break;
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  },

  // ✅ UPDATED SIGNUP FUNCTION - Better error handling for existing users
  signup: async (data) => {
    set({ isLoading: true });
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
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

      if (authError) {
        console.error('Signup error:', authError);

        const message = authError.message?.toLowerCase() || '';
        const status = authError.status?.toString() || '';

        // Enhanced existing user detection
        if (message.includes('user already registered') ||
          message.includes('already exists') ||
          message.includes('email already') ||
          message.includes('already in use') ||
          status === '422' || // Unprocessable Entity - often used for existing users
          message.includes('duplicate') ||
          message.includes('conflict')) {
          throw new Error('An account with this email already exists. Please log in instead.');
        }

        if (message.includes('password')) {
          throw new Error('Password must be at least 8 characters long.');
        }
        if (message.includes('rate limit') || message.includes('too many requests')) {
          throw new Error('Too many signup attempts. Please try again later.');
        }
        throw new Error(authError.message || 'Failed to create account. Please try again.');
      }

      // Check if user already exists but email confirmation might be pending
      if (authData.user && authData.user.identities && authData.user.identities.length === 0) {
        throw new Error('An account with this email already exists. Please log in instead.');
      }

      if (!authData.user) {
        throw new Error('Failed to create account. Please try again.');
      }

      // Only create a profile if immediate session exists (email confirmations disabled)
      if (authData.session) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              username: data.email.split('@')[0],
              full_name: data.name,
              university: data.college,
              major: '',
              skills: [],
              interests: [],
            }
          ]);

        if (profileError && profileError.code !== '23505') {
          console.error('Profile creation error:', profileError);
        }

        set({
          user: authData.user,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      set({ isLoading: false });
      throw new Error(error.message || 'Failed to create account. Please try again.');
    }
  },

  // --- Everything below is unchanged ---
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);

        if (error.message.includes('Invalid login credentials')) {
          const { error: resetCheckError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password?code=reset`,
          });

          if (resetCheckError?.message?.includes('not found') ||
            resetCheckError?.message?.includes('does not exist')) {
            throw new Error('No account found with this email address. Please sign up first.');
          }

          throw new Error('Invalid email or password. Please try again.');
        }

        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please confirm your email address before logging in.');
        }

        if (error.message.includes('too many requests')) {
          throw new Error('Too many login attempts. Please try again later.');
        }

        throw new Error(error.message || 'Login failed. Please try again.');
      }

      if (!data.user) throw new Error('Login failed. Please try again.');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        const userMetadata = data.user.user_metadata;
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              username: data.user.email?.split('@')[0] || 'user',
              full_name: userMetadata.full_name || userMetadata.name || 'User',
              avatar_url: userMetadata.avatar_url || userMetadata.picture,
              university: userMetadata.college || '',
              major: '',
              skills: [],
              interests: [],
            }
          ]);

        if (insertError) console.error('Error creating profile:', insertError);

        const { data: newProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        set({
          user: data.user,
          profile: newProfile,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        set({
          user: data.user,
          profile,
          isAuthenticated: true,
          isLoading: false
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
    } catch (error: any) {
      console.error('Logout error:', error);
      set({ isLoading: false });
      throw new Error(error.message || 'Failed to logout. Please try again.');
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google signin error:', error);
        if (error.message.includes('popup')) {
          throw new Error('Popup blocked. Please allow popups for this site.');
        }
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error('Google signin error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  signInWithGithub: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('GitHub signin error:', error);
        if (error.message.includes('popup')) {
          throw new Error('Popup blocked. Please allow popups for this site.');
        }
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error('GitHub signin error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password?code=reset`,
      });

      if (error) {
        console.error('Reset password error:', error);
        if (error.message.includes('not found') || error.message.includes('does not exist')) {
          throw new Error('No account found with this email address. Please sign up first.');
        }
        if (error.message.includes('rate limit')) {
          throw new Error('Too many reset attempts. Please try again later.');
        }
        throw new Error(error.message);
      }

      set({ isLoading: false });
    } catch (error: any) {
      console.error('Reset password error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updatePassword: async (newPassword: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Update password error:', error);
        if (error.message.includes('weak')) {
          throw new Error('Password is too weak. Please use a stronger password.');
        }
        throw new Error(error.message);
      }

      if (!data.user) throw new Error('Failed to update password. Please try again.');
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Update password error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  checkResetSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session?.user;
    } catch (error) {
      console.error('Error checking reset session:', error);
      return false;
    }
  },

  resendConfirmationEmail: async (email: string) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Resend email error:', error);
        if (error.message.includes('already confirmed')) {
          throw new Error('This email has already been confirmed. Please try logging in.');
        }
        if (error.message.includes('not found') || error.message.includes('does not exist')) {
          throw new Error('No account found with this email address.');
        }
        throw new Error(error.message);
      }

      set({ isLoading: false });
    } catch (error: any) {
      console.error('Resend email error:', error);
      set({ isLoading: false });
      throw error;
    }
  },
}));
