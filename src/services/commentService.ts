import { supabase } from '../config/supabase';
import type { NoteComment } from '../types';

export const commentService = {
  // Get comments for a note
  async getNoteComments(noteId: string): Promise<NoteComment[]> {
    const { data, error } = await supabase
      .from('note_comments')
      .select(`
        *,
        user:profiles(*)
      `)
      .eq('note_id', noteId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Add a comment to a note
  async addComment(noteId: string, content: string): Promise<NoteComment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if note exists and allows comments
    const { data: note } = await supabase
      .from('notes')
      .select('id, allow_comments')
      .eq('id', noteId)
      .single();

    if (!note) throw new Error('Note not found');
    if (!note.allow_comments) throw new Error('Comments are disabled for this note');

    const { data, error } = await supabase
      .from('note_comments')
      .insert({
        note_id: noteId,
        user_id: user.id,
        content: content
      })
      .select(`
        *,
        user:profiles(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a comment (only by comment owner or note owner)
  async deleteComment(commentId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get comment and note info
    const { data: comment } = await supabase
      .from('note_comments')
      .select('*, note:notes(user_id)')
      .eq('id', commentId)
      .single();

    if (!comment) throw new Error('Comment not found');

    // Check if user is comment owner or note owner
    const isCommentOwner = comment.user_id === user.id;
    const isNoteOwner = comment.note.user_id === user.id;

    if (!isCommentOwner && !isNoteOwner) {
      throw new Error('Not authorized to delete this comment');
    }

    const { error } = await supabase
      .from('note_comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
  },

  // Subscribe to comments for real-time updates
  subscribeToComments(noteId: string, callback: (comment: NoteComment) => void) {
    const subscription = supabase
      .channel(`public:note_comments:${noteId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'note_comments',
          filter: `note_id=eq.${noteId}`
        },
        async (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            // Fetch the complete comment with user data
            const { data } = await supabase
              .from('note_comments')
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