import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, Theme, Order, Testimonial } from '../types';

interface AppState {
  // UI State
  theme: Theme;
  language: Language;
  isMenuOpen: boolean;
  
  // Data State
  orders: Order[];
  testimonials: Testimonial[];
  
  // Actions
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setMenuOpen: (isOpen: boolean) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  setOrders: (orders: Order[]) => void;
  setTestimonials: (testimonials: Testimonial[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      theme: 'light',
      language: 'en',
      isMenuOpen: false,
      orders: [],
      testimonials: [],

      // Actions
      setTheme: (theme: Theme) => {
        set({ theme });
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },

      setLanguage: (language: Language) => {
        set({ language });
      },

      setMenuOpen: (isOpen: boolean) => {
        set({ isMenuOpen: isOpen });
      },

      addOrder: (order: Order) => {
        const currentOrders = get().orders;
        set({ orders: [order, ...currentOrders] });
      },

      updateOrder: (orderId: string, updates: Partial<Order>) => {
        const currentOrders = get().orders;
        const updatedOrders = currentOrders.map(order =>
          order._id === orderId ? { ...order, ...updates } : order
        );
        set({ orders: updatedOrders });
      },

      setOrders: (orders: Order[]) => {
        set({ orders });
      },

      setTestimonials: (testimonials: Testimonial[]) => {
        set({ testimonials });
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ 
        theme: state.theme, 
        language: state.language 
      }),
    }
  )
);