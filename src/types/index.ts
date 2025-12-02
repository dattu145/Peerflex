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
  category: 'portfolio' | 'linkedin' | 'github' | 'package';
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
  comment_count: number;
  is_public: boolean;
  is_approved: boolean;
  ai_summary?: string;
  difficulty_level?: number;
  rating: number;
  created_at: string;
  updated_at: string;
  user?: Profile;
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

export interface NoteComment {
  id: string;
  note_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: Profile;
}

export interface NoteView {
  id: string;
  note_id: string;
  user_id: string;
  viewed_at: string;
  user?: Profile;
}


// Event and Hangouts types,

export interface Event {
  id: string;
  title: string;
  description: string;
  event_type: 'workshop' | 'study_group' | 'social' | 'hackathon' | 'career' | 'sports';
  location: any; // PostGIS geography type
  address: string;
  venue_name: string;
  start_time: string;
  end_time: string;
  max_attendees: number;
  is_public: boolean;
  is_virtual: boolean;
  meeting_url: string;
  cover_image_url: string;
  tags: string[];
  created_by: string;
  created_at: string;
  organizer_name?: string;
  organizer_avatar_url?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  price: number;
  currency: string;
  registration_deadline: string;
  is_cancelled: boolean;
  cancellation_reason?: string;
  user?: Profile; // Joined profile data
  attendees_count?: number;
  current_user_attendance?: EventAttendance;
}

export interface EventAttendance {
  id: string;
  event_id: string;
  user_id: string;
  status: 'registered' | 'attended' | 'cancelled';
  registered_at: string;
  joined_at?: string;
  left_at?: string;
  attendance_duration?: number;
  user?: Profile;
}


export interface EventCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  is_active: boolean;
  created_at: string;
}

export interface HangoutSpot {
  id: string;
  name: string;
  description: string;
  location: any; // PostGIS geography type
  address: string;
  spot_type: 'cafe' | 'library' | 'park' | 'study_room' | 'food' | 'social' | 'sports' | 'other';
  capacity: number;
  current_occupancy: number;
  amenities: string[];
  is_verified: boolean;
  created_by: string;
  created_at: string;
  operating_hours?: {
    open: string;
    close: string;
    days: number[];
  };
  contact_info?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  rating: number;
  review_count: number;
  images: string[];
  is_active: boolean;
  verification_status: 'pending' | 'verified' | 'rejected' | 'suspended';
  user?: Profile; // Joined profile data
  distance?: number; // Calculated distance in meters
  user_checkin?: HangoutCheckin; // Current user's checkin
}

export interface HangoutCheckin {
  id: string;
  hangout_spot_id: string;
  user_id: string;
  checkin_time: string;
  checkout_time?: string;
  is_current: boolean;
  user?: Profile;
  hangout_spot?: HangoutSpot;
}

export interface HangoutSpotReview {
  id: string;
  hangout_spot_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  images: string[];
  created_at: string;
  updated_at: string;
  user?: Profile;
  hangout_spot?: HangoutSpot;
}


export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  accuracy?: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}


export type Language = 'en' | 'ta' | 'te' | 'hi';
export type Theme = 'light' | 'dark';