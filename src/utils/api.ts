import axios from 'axios';
import Cookies from 'js-cookie';
import { APP_CONFIG } from '../config/constants';

const api = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API Functions
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  signup: (userData: any) =>
    api.post('/auth/signup', userData),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateProfile: (updates: any) =>
    api.put('/auth/profile', updates),
};

export const ordersAPI = {
  createOrder: (orderData: any) =>
    api.post('/orders', orderData),
  
  getUserOrders: () =>
    api.get('/orders/user'),
  
  getOrderById: (orderId: string) =>
    api.get(`/orders/${orderId}`),
  
  updateOrderStatus: (orderId: string, status: string) =>
    api.put(`/orders/${orderId}/status`, { status }),
};

export const adminAPI = {
  getAllOrders: () =>
    api.get('/admin/orders'),
  
  updateOrder: (orderId: string, updates: any) =>
    api.put(`/admin/orders/${orderId}`, updates),
  
  getAnalytics: () =>
    api.get('/admin/analytics'),
};

export const testimonialAPI = {
  getTestimonials: () =>
    api.get('/testimonials'),
  
  createTestimonial: (testimonialData: any) =>
    api.post('/testimonials', testimonialData),
  
  updateTestimonial: (testimonialId: string, updates: any) =>
    api.put(`/testimonials/${testimonialId}`, updates),
};