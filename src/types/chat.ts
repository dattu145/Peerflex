// Chat-specific types
export interface ConnectionRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  created_at: string;
  updated_at: string;
  from_profile?: Profile;
  to_profile?: Profile;
}

export interface UserConnection {
  id: string;
  user_id: string;
  connected_user_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  connected_at: string;
  connected_user?: Profile;
}

export interface ChatRoom {
  id: string;
  name?: string;
  description?: string;
  is_group: boolean;
  is_public: boolean;
  subject?: string;
  max_members?: number;
  created_by?: string;
  created_at: string;
  members?: ChatMember[];
  last_message?: Message;
  unread_count?: number;
}

export interface ChatMember {
  id: string;
  chat_room_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  profile?: Profile;
}

export interface Message {
  id: string;
  chat_room_id: string;
  user_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  file_url?: string;
  reply_to?: string;
  read_by: string[];
  created_at: string;
  user?: Profile;
  reply_message?: Message;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string;
  lastMessage?: string;
  timestamp: string;
  unread: number;
  avatar: string;
  chat_room: ChatRoom;
  other_user?: Profile;
}