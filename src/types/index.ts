// src/types/index.ts

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  major?: string;
  university?: string;
  year_of_study?: number;
  skills?: string[];
  interests?: string[];
  current_location?: any;
  last_online?: string;
  is_online?: boolean;
  privacy_settings?: {
    show_notes: boolean;
    show_location: boolean;
    show_online_status: boolean;
  };
  reputation_score?: number;
  notes_count: number; // Now this is a direct database field
  created_at: string;
  updated_at: string;
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

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  subject: string;
  course_code?: string;
  university?: string;
  tags: string[];
  file_url?: string;
  file_size?: number;
  download_count: number;
  view_count: number;
  like_count: number;
  is_public: boolean;
  is_approved: boolean;
  ai_summary?: string;
  difficulty_level?: number;
  rating: number;
  created_at: string;
  updated_at: string;
  user?: Profile; // Joined profile data
  // Add new fields
  allow_comments?: boolean;
  show_likes?: boolean;
}

export interface NoteReview {
  id: string;
  note_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  user?: Profile;
  helpful_count?: number;
}

export interface Notification {
  id: string;
  user_id: string;
  from_user_id?: string;
  type: 'friend_request' | 'note_shared' | 'connection_accepted' | 'message' | 'system';
  title: string;
  message: string;
  data?: any; // JSON data for additional context
  is_read: boolean;
  created_at: string;
  updated_at: string;
  from_user?: Profile; // Joined profile data
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