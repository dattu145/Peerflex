export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  subject: string;
  tags: string[];
  is_public: boolean;
  views: number;
  likes: number;
  created_at: string;
  updated_at: string;
}

export interface NoteLike {
  id: string;
  note_id: string;
  user_id: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  job_type: 'full-time' | 'part-time' | 'internship' | 'contract';
  salary_range: string;
  requirements: string[];
  skills: string[];
  application_url: string;
  posted_by: string;
  expires_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  user_id: string;
  status: 'pending' | 'applied' | 'accepted' | 'rejected';
  applied_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_type: 'workshop' | 'hangout' | 'study-group' | 'hackathon' | 'social';
  location: string;
  start_time: string;
  end_time: string;
  max_participants: number;
  current_participants: number;
  created_by: string;
  tags: string[];
  is_virtual: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  status: 'registered' | 'attended' | 'cancelled';
  joined_at: string;
}

export interface OpenSourceProject {
  id: string;
  name: string;
  description: string;
  repository_url: string;
  tech_stack: string[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  looking_for: string[];
  created_by: string;
  contributors: number;
  stars: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectContributor {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}
