import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // TODO: Replace with actual API call
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          
          if (response.ok) {
            const data = await response.json();
            const { user, token } = data;
            
            Cookies.set('auth-token', token, { expires: 7 });
            set({ user, isAuthenticated: true });
          } else {
            throw new Error('Login failed');
          }
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async (userData: any) => {
        set({ isLoading: true });
        try {
          // Generate referral code
          const referralCode = `REF${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
          
          // TODO: Replace with actual API call
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...userData, referralCode }),
          });
          
          if (response.ok) {
            const data = await response.json();
            const { user, token } = data;
            
            Cookies.set('auth-token', token, { expires: 7 });
            set({ user, isAuthenticated: true });
          } else {
            throw new Error('Signup failed');
          }
        } catch (error) {
          console.error('Signup error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        Cookies.remove('auth-token');
        set({ user: null, isAuthenticated: false });
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);