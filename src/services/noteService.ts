import { supabase } from '../config/supabase';
import type { Note, NoteReview } from '../types';

export const noteService = {
  // Get all public notes with filters
  async getPublicNotes(filters?: {
    subject?: string;
    search?: string;
    tags?: string[];
    limit?: number;
    page?: number;
  }): Promise<Note[]> {
    let query = supabase
      .from('notes')
      .select(`
        *,
        user:profiles(*)
      `)
      .eq('is_public', true)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (filters?.subject && filters.subject !== 'all') {
      query = query.eq('subject', filters.subject);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%,tags.cs.{${filters.search}}`);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags);
    }

    if (filters?.limit) {
      const page = filters.page || 0;
      query = query.range(page * filters.limit, (page + 1) * filters.limit - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  // Get notes by current user
  async getUserNotes(): Promise<Note[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get note by ID
  async getNoteById(noteId: string): Promise<Note | null> {
    const { data, error } = await supabase
      .from('notes')
      .select(`
        *,
        user:profiles(*)
      `)
      .eq('id', noteId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Create a new note
  async createNote(noteData: {
    title: string;
    content: string;
    subject: string;
    course_code?: string;
    university?: string;
    tags: string[];
    file_url?: string;
    file_size?: number;
    is_public?: boolean;
    allow_comments?: boolean;
    show_likes?: boolean;
  }): Promise<Note> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('notes')
      .insert({
        ...noteData,
        user_id: user.id,
        is_public: noteData.is_public ?? true,
        is_approved: true, // Auto-approve for now, can add moderation later
        allow_comments: noteData.allow_comments ?? true,
        show_likes: noteData.show_likes ?? true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update note
  async updateNote(noteId: string, updates: Partial<Note>): Promise<Note> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Verify ownership
    const { data: existingNote } = await supabase
      .from('notes')
      .select('user_id')
      .eq('id', noteId)
      .single();

    if (!existingNote || existingNote.user_id !== user.id) {
      throw new Error('Not authorized to update this note');
    }

    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', noteId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete note
  async deleteNote(noteId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Verify ownership
    const { data: existingNote } = await supabase
      .from('notes')
      .select('user_id')
      .eq('id', noteId)
      .single();

    if (!existingNote || existingNote.user_id !== user.id) {
      throw new Error('Not authorized to delete this note');
    }

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);

    if (error) throw error;
  },

  // Increment view count
  async incrementViewCount(noteId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_note_views', { note_id: noteId });
    if (error) throw error;
  },

  // Like/unlike note
  async toggleLike(noteId: string): Promise<{ liked: boolean; like_count: number }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if already liked
    const { data: existingReview } = await supabase
      .from('note_reviews')
      .select('id, rating')
      .eq('note_id', noteId)
      .eq('user_id', user.id)
      .single();

    if (existingReview) {
      // Unlike - delete the review
      await supabase
        .from('note_reviews')
        .delete()
        .eq('id', existingReview.id);

      // Decrement like count
      await supabase.rpc('decrement_note_likes', { note_id: noteId });
    } else {
      // Like - create review with rating 5 (like)
      await supabase
        .from('note_reviews')
        .insert({
          note_id: noteId,
          user_id: user.id,
          rating: 5
        });

      // Increment like count
      await supabase.rpc('increment_note_likes', { note_id: noteId });
    }

    // Get updated like count
    const { data: note } = await supabase
      .from('notes')
      .select('like_count')
      .eq('id', noteId)
      .single();

    return {
      liked: !existingReview,
      like_count: note?.like_count || 0
    };
  },

  // Subscribe to notes changes for real-time updates
  subscribeToNotes(callback: (note: Note) => void) {
    const subscription = supabase
      .channel('public:notes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
          filter: 'is_public=eq.true'
        },
        async (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            // Fetch the complete note with user data
            const { data } = await supabase
              .from('notes')
              .select(`
                *,
                user:profiles(*)
              `)
              .eq('id', payload.new.id)
              .single();

            if (data) {
              callback(data);
            }
          }
        }
      )
      .subscribe();

    return subscription;
  }
};