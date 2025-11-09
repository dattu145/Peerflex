// src/types/index.ts

// Profile type matching Supabase schema
export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string | null;
  bio?: string | null;
  major?: string | null;
  university?: string | null;
  year_of_study?: number | null;
  skills?: string[] | null;
  interests?: string[] | null;
  current_location?: any | null; // PostGIS geography type
  last_online?: string | null;
  is_online?: boolean;
  privacy_settings?: {
    show_notes: boolean;
    show_location: boolean;
    show_online_status: boolean;
  };
  reputation_score?: number;
  created_at?: string;
  updated_at?: string;
}

import type { 
  ConnectionRequest, 
  UserConnection, 
  ChatRoom, 
  ChatMember, 
  Message,
  Conversation 
} from './chat';

export type { 
  ConnectionRequest, 
  UserConnection, 
  ChatRoom, 
  ChatMember, 
  Message,
  Conversation 
};


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

// Peerflex specific types
export interface Note {
  id: string;
  user_id: string;
  title: string;
  subject: string;
  content: string;
  file_url?: string;
  tags: string[];
  downloads: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  event_time: string;
  organizer: string;
  category: 'workshop' | 'seminar' | 'hackathon' | 'social' | 'other';
  max_participants?: number;
  registered_count: number;
  image_url?: string;
  created_at: string;
}

export type Language = 'en' | 'ta' | 'te' | 'hi';
export type Theme = 'light' | 'dark';