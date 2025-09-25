// src/config/constants.ts

export const APP_CONFIG = {
  name: 'CampusPro',
  description: 'Professional career tools powered by AI',
  version: '1.0.0',

  // Pricing
  referralDiscount: 20, // ₹20 per referral
  maxReferrals: 5,

  // Admin (⚠️ only keep adminEmail on frontend)
  adminEmail: 'admin@campuspro.com',

  // API
  apiBaseUrl: import.meta.env.MODE === 'production'
    ? 'https://your-api-domain.com/api'
    : import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',

  // Social Links (safe for frontend)
  socialLinks: {
    twitter: 'https://twitter.com/campuspro',
    linkedin: 'https://linkedin.com/company/campuspro',
    instagram: 'https://instagram.com/campuspro',
    github: 'https://github.com/campuspro'
  },

  // Contact
  contactEmail: 'yourcampuspro@gmail.com',
  contactPhone: '+91-8008998312',
  whatsappNumber: '+918008998312'
};

export const ORDER_STATUSES = {
  pending: { label: 'Pending', color: 'yellow', description: 'Order received and being reviewed' },
  'in-progress': { label: 'In Progress', color: 'blue', description: 'Work in progress' },
  completed: { label: 'Completed', color: 'green', description: 'Work completed, ready for delivery' },
  delivered: { label: 'Delivered', color: 'purple', description: 'Final files delivered' }
};

export const PAYMENT_METHODS = {
  upi: { name: 'UPI', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=campuspro@paytm&pn=CampusPro&cu=INR' },
  card: { name: 'Credit/Debit Card', enabled: false },
  netbanking: { name: 'Net Banking', enabled: false }
};