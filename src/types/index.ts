export interface User {
  _id: string;
  name: string;
  email: string;
  college: string;
  city: string;
  role: 'student' | 'professional';
  referralCode: string;
  referredBy?: string;
  referrals: string[];
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: 'resume' | 'portfolio' | 'linkedin' | 'github' | 'package';
  templates: ServiceTemplate[];
  features: string[];
}

export interface ServiceTemplate {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  difficulty: 'basic' | 'advanced' | 'premium';
}

export interface Order {
  _id: string;
  userId: string;
  services: SelectedService[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: 'pending' | 'in-progress' | 'completed' | 'delivered';
  referralDiscount: number;
  paymentStatus: 'pending' | 'paid';
  createdAt: string;
  updatedAt: string;
  deliveryFiles?: string[];
  userDetails?: any;
  aiRequirements?: string;
}

export interface SelectedService {
  serviceId: string;
  serviceName: string;
  templateId: string;
  templateName: string;
  price: number;
  customizations?: Record<string, any>;
}

export interface Testimonial {
  _id: string;
  userId: string;
  userName: string;
  userRole: string;
  rating: number;
  comment: string;
  createdAt: string;
  featured: boolean;
}

export type Language = 'en' | 'ta' | 'te' | 'hi';
export type Theme = 'light' | 'dark';