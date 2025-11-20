import { useState, useEffect, useCallback, useRef } from 'react';
import { noteService } from '../services/noteService';
import type { Note } from '../types';
import { useAuthStore } from '../store/useAuthStore';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLikedNotes, setUserLikedNotes] = useState<Set<string>>(new Set());
  
  const { user } = useAuthStore();
  
  // Track current state for smart real-time updates
  const currentState = useRef({
    viewMode: 'community' as 'community' | 'my' | 'favorites',
    filters: {} as any,
    userId: user?.id
  });

  // Load user's liked notes
  const loadUserLikedNotes = useCallback(async () => {
    try {
      const likedNotes = await noteService.getUserLikedNotes();
      const likedNoteIds = new Set(likedNotes.map(note => note.id));
      setUserLikedNotes(likedNoteIds);
    } catch (err) {
      console.error('Failed to load user liked notes:', err);
    }
  }, []);

  // Single source of truth for real-time updates - FIXED VERSION
  const handleRealTimeUpdate = useCallback((payload: { event: 'INSERT' | 'UPDATE' | 'DELETE', note: Note | { id: string } }) => {
    setNotes(prev => {
      const { viewMode, filters, userId } = currentState.current;
      
      // Handle DELETE - always remove deleted notes
      if (payload.event === 'DELETE') {
        return prev.filter(note => note.id !== payload.note.id);
      }
      
      const updatedNote = payload.note as Note;
      
      // Check if note should be visible in current view - IMPROVED LOGIC
      const shouldShowNote = () => {
        // For community view - show public, approved notes that match filters
        if (viewMode === 'community') {
          if (!updatedNote.is_public || !updatedNote.is_approved) return false;
          
          if (filters?.subject && filters.subject !== 'all') {
            return updatedNote.subject === filters.subject;
          }
          
          if (filters?.search) {
            const searchLower = filters.search.toLowerCase();
            return updatedNote.title.toLowerCase().includes(searchLower) ||
                   updatedNote.content.toLowerCase().includes(searchLower) ||
                   updatedNote.tags.some(tag => tag.toLowerCase().includes(searchLower));
          }
          
          return true;
        }
        
        // For my notes - show only user's notes
        if (viewMode === 'my') {
          return updatedNote.user_id === userId;
        }
        
        // For favorites - show only liked notes
        if (viewMode === 'favorites') {
          return userLikedNotes.has(updatedNote.id);
        }
        
        return false;
      };

      const existingIndex = prev.findIndex(n => n.id === updatedNote.id);
      
      // Handle INSERT - new notes
      if (payload.event === 'INSERT') {
        if (shouldShowNote()) {
          // Add new note to the beginning
          return [updatedNote, ...prev];
        }
        return prev;
      }
      
      // Handle UPDATE - existing notes
      if (existingIndex >= 0) {
        if (shouldShowNote()) {
          // Update existing note
          const newNotes = [...prev];
          newNotes[existingIndex] = updatedNote;
          return newNotes;
        } else {
          // Remove from view if no longer matches current filters
          return prev.filter(n => n.id !== updatedNote.id);
        }
      } else {
        // This is an UPDATE for a note that wasn't in our current view
        if (shouldShowNote()) {
          // Add it to the view
          return [updatedNote, ...prev];
        }
        return prev;
      }
    });
  }, [userLikedNotes]);

  // Load initial data
  const loadNotes = useCallback(async (
    viewMode: 'community' | 'my' | 'favorites', 
    filters?: any
  ) => {
    try {
      setLoading(true);
      currentState.current = { viewMode, filters, userId: user?.id };
      
      let data: Note[] = [];
      
      switch (viewMode) {
        case 'my':
          data = await noteService.getUserNotes();
          break;
        case 'favorites':
          data = await noteService.getUserLikedNotes();
          break;
        case 'community':
        default:
          data = await noteService.getPublicNotes(filters);
          break;
      }
      
      setNotes(data);
      setError(null);
      
      // Always update liked notes set for accurate real-time filtering
      await loadUserLikedNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [user?.id, loadUserLikedNotes]);

  // Real-time subscription - FIXED: Now properly handles all events
  useEffect(() => {
    const subscription = noteService.subscribeToNotes(handleRealTimeUpdate);
    return () => subscription.unsubscribe();
  }, [handleRealTimeUpdate]);

  // Simplified API
  const loadPublicNotes = useCallback((filters?: any) => 
    loadNotes('community', filters), [loadNotes]);
  
  const loadUserNotes = useCallback(() => 
    loadNotes('my'), [loadNotes]);
  
  const loadFavoriteNotes = useCallback(() => 
    loadNotes('favorites'), [loadNotes]);

  // FIXED: likeNote with immediate favorites update
  const likeNote = useCallback(async (noteId: string) => {
    const previousNotes = [...notes];
    const previousLikedNotes = new Set(userLikedNotes);
    const { viewMode } = currentState.current;
    
    try {
      // Optimistic update - instant UI response
      const wasLiked = userLikedNotes.has(noteId);
      
      setNotes(prev => prev.map(note =>
        note.id === noteId 
          ? { ...note, like_count: note.like_count + (wasLiked ? -1 : 1) }
          : note
      ));
      
      // Update liked notes immediately
      setUserLikedNotes(prev => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.delete(noteId);
        } else {
          newSet.add(noteId);
        }
        return newSet;
      });

      // If we're in favorites view and unliking, remove the note immediately
      if (viewMode === 'favorites' && wasLiked) {
        setNotes(prev => prev.filter(note => note.id !== noteId));
      }

      // Actual API call
      const result = await noteService.toggleLike(noteId);
      
      // Sync with server response
      setNotes(prev => prev.map(note =>
        note.id === noteId 
          ? { ...note, like_count: result.like_count }
          : note
      ));
      
      return result;
    } catch (err) {
      // Revert on error
      setNotes(previousNotes);
      setUserLikedNotes(previousLikedNotes);
      setError(err instanceof Error ? err.message : 'Failed to like note');
      throw err;
    }
  }, [notes, userLikedNotes]);

  const createNote = useCallback(async (noteData: {
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
  }) => {
    try {
      const newNote = await noteService.createNote({
        ...noteData,
        allow_comments: noteData.allow_comments ?? true,
        show_likes: noteData.show_likes ?? true,
      });
      
      return newNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
      throw err;
    }
  }, []);

  const updateNote = useCallback(async (noteId: string, updates: Partial<Note>) => {
    try {
      const updatedNote = await noteService.updateNote(noteId, updates);
      return updatedNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
      throw err;
    }
  }, []);

  const deleteNote = useCallback(async (noteId: string) => {
    try {
      await noteService.deleteNote(noteId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
      throw err;
    }
  }, []);

  const incrementViewCount = useCallback(async (noteId: string) => {
    try {
      await noteService.incrementViewCount(noteId);
    } catch (err) {
      console.error('Failed to increment view count:', err);
    }
  }, []);

  // Load public notes by default
  useEffect(() => {
    if (user) {
      loadPublicNotes();
    }
  }, [loadPublicNotes, user]);

  return {
    notes,
    loading,
    error,
    loadPublicNotes,
    loadUserNotes,
    loadFavoriteNotes,
    createNote,
    updateNote,
    deleteNote,
    likeNote,
    incrementViewCount,
    userLikedNotes,
    refresh: () => loadNotes(currentState.current.viewMode, currentState.current.filters)
  };
};