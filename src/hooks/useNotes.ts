import { useState, useEffect, useCallback, useRef } from 'react';
import { noteService } from '../services/noteService';
import type { Note } from '../types';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLikedNotes, setUserLikedNotes] = useState<Set<string>>(new Set());
  
  // Track current view mode to prevent data conflicts
  const currentViewMode = useRef<'community' | 'my' | 'favorites'>('community');
  const subscriptionRef = useRef<any>(null);

  const loadPublicNotes = useCallback(async (filters?: {
    subject?: string;
    search?: string;
    tags?: string[];
  }) => {
    try {
      setLoading(true);
      currentViewMode.current = 'community';
      const data = await noteService.getPublicNotes(filters);
      setNotes(data);
      setError(null);
      
      // Load user's liked notes to track which notes are liked
      await loadUserLikedNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user's liked notes for tracking
  const loadUserLikedNotes = useCallback(async () => {
    try {
      const likedNotes = await noteService.getUserLikedNotes();
      const likedNoteIds = new Set(likedNotes.map(note => note.id));
      setUserLikedNotes(likedNoteIds);
    } catch (err) {
      console.error('Failed to load user liked notes:', err);
    }
  }, []);

  // Add real-time subscription - ONLY for community view
  useEffect(() => {
    const handleNoteUpdate = (newNote: Note) => {
      // Only update if we're in community view mode
      if (currentViewMode.current === 'community') {
        setNotes(prev => {
          // Check if note already exists
          const exists = prev.find(n => n.id === newNote.id);
          if (exists) {
            // Update existing note
            return prev.map(n => n.id === newNote.id ? newNote : n);
          } else {
            // Add new note
            return [newNote, ...prev];
          }
        });
      }
    };

    subscriptionRef.current = noteService.subscribeToNotes(handleNoteUpdate);

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []);

  const loadUserNotes = useCallback(async () => {
    try {
      setLoading(true);
      currentViewMode.current = 'my';
      const data = await noteService.getUserNotes();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load your notes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load favorite notes
  const loadFavoriteNotes = useCallback(async () => {
    try {
      setLoading(true);
      currentViewMode.current = 'favorites';
      const data = await noteService.getUserLikedNotes();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load favorite notes');
    } finally {
      setLoading(false);
    }
  }, []);

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
      
      // Only add to notes if we're in community or my notes view
      if (currentViewMode.current === 'community' || currentViewMode.current === 'my') {
        setNotes(prev => [newNote, ...prev]);
      }
      
      return newNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
      throw err;
    }
  }, []);

  const updateNote = useCallback(async (noteId: string, updates: Partial<Note>) => {
    try {
      const updatedNote = await noteService.updateNote(noteId, updates);
      
      // Update note in current view if it exists
      setNotes(prev => prev.map(note => 
        note.id === noteId ? updatedNote : note
      ));
      
      return updatedNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
      throw err;
    }
  }, []);

  const deleteNote = useCallback(async (noteId: string) => {
    try {
      await noteService.deleteNote(noteId);
      setNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
      throw err;
    }
  }, []);

  const likeNote = useCallback(async (noteId: string) => {
    try {
      const result = await noteService.toggleLike(noteId);
      
      // Update the specific note's like count if it exists in current view
      setNotes(prev => prev.map(note =>
        note.id === noteId 
          ? { ...note, like_count: result.like_count }
          : note
      ));
      
      // Update user liked notes set
      if (result.liked) {
        setUserLikedNotes(prev => new Set([...prev, noteId]));
      } else {
        setUserLikedNotes(prev => {
          const newSet = new Set(prev);
          newSet.delete(noteId);
          return newSet;
        });
      }
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like note');
      throw err;
    }
  }, []);

  const incrementViewCount = useCallback(async (noteId: string) => {
    try {
      await noteService.incrementViewCount(noteId);
      setNotes(prev => prev.map(note =>
        note.id === noteId 
          ? { ...note, view_count: (note.view_count || 0) + 1 }
          : note
      ));
    } catch (err) {
      console.error('Failed to increment view count:', err);
    }
  }, []);

  // Auto-refresh notes every 30 seconds - ONLY for community view
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentViewMode.current === 'community') {
        loadPublicNotes();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loadPublicNotes]);

  // Load public notes by default
  useEffect(() => {
    loadPublicNotes();
  }, [loadPublicNotes]);

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
    refresh: () => {
      // Refresh based on current view mode
      if (currentViewMode.current === 'my') {
        loadUserNotes();
      } else if (currentViewMode.current === 'favorites') {
        loadFavoriteNotes();
      } else {
        loadPublicNotes();
      }
    }
  };
};