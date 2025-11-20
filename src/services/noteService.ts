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

  async toggleLike(noteId: string): Promise<{ liked: boolean; like_count: number }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    try {
      // Check if already liked
      const { data: existingReview, error: checkError } = await supabase
        .from('note_reviews')
        .select('id, rating')
        .eq('note_id', noteId)
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing review:', checkError);
        throw checkError;
      }

      if (existingReview) {
        // Unlike - delete the review
        const { error: deleteError } = await supabase
          .from('note_reviews')
          .delete()
          .eq('id', existingReview.id);

        if (deleteError) {
          console.error('Error deleting review:', deleteError);
          throw deleteError;
        }

        // Decrement like count
        const { error: decrementError } = await supabase.rpc('decrement_note_likes', { note_id: noteId });
        if (decrementError) {
          console.error('Error decrementing like count:', decrementError);
          throw decrementError;
        }

        console.log(`User ${user.id} unliked note ${noteId}`);
      } else {
        // Like - create review with rating 5 (like)
        const { error: insertError } = await supabase
          .from('note_reviews')
          .insert({
            note_id: noteId,
            user_id: user.id,
            rating: 5
          });

        if (insertError) {
          console.error('Error inserting review:', insertError);
          throw insertError;
        }

        // Increment like count
        const { error: incrementError } = await supabase.rpc('increment_note_likes', { note_id: noteId });
        if (incrementError) {
          console.error('Error incrementing like count:', incrementError);
          throw incrementError;
        }

        console.log(`User ${user.id} liked note ${noteId}`);
      }

      // Get updated like count
      const { data: note, error: fetchError } = await supabase
        .from('notes')
        .select('like_count')
        .eq('id', noteId)
        .single();

      if (fetchError) {
        console.error('Error fetching updated like count:', fetchError);
        throw fetchError;
      }

      return {
        liked: !existingReview,
        like_count: note?.like_count || 0
      };
    } catch (error) {
      console.error('Failed to toggle like:', error);
      throw error;
    }
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

  async incrementViewCount(noteId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    try {
      // Check if user has already viewed this note using the new note_views table
      const { data: existingView, error: checkError } = await supabase
        .from('note_views')
        .select('id')
        .eq('note_id', noteId)
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing view:', checkError);
        throw checkError;
      }

      // If user hasn't viewed this note before, increment count
      if (!existingView) {
        // Record the view in note_views table
        const { error: viewError } = await supabase
          .from('note_views')
          .insert({
            note_id: noteId,
            user_id: user.id,
          });

        if (viewError) {
          console.error('Error inserting view:', viewError);
          throw viewError;
        }

        // Increment the view count in notes table
        const { error: countError } = await supabase.rpc('increment_note_views', { note_id: noteId });
        if (countError) {
          console.error('Error incrementing view count:', countError);
          throw countError;
        }

        console.log(`View count incremented for note ${noteId} by user ${user.id}`);
      } else {
        console.log(`User ${user.id} already viewed note ${noteId}`);
      }
    } catch (error) {
      console.error('Failed to increment view count:', error);
      throw error;
    }
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