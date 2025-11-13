import { useState, useEffect, useCallback } from 'react';
import { noteService } from '../services/noteService';
import type { Note } from '../types';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPublicNotes = useCallback(async (filters?: {
    subject?: string;
    search?: string;
    tags?: string[];
  }) => {
    try {
      setLoading(true);
      const data = await noteService.getPublicNotes(filters);
      setNotes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add real-time subscription
  useEffect(() => {
    const subscription = noteService.subscribeToNotes((newNote) => {
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
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const loadUserNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await noteService.getUserNotes();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load your notes');
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
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
      throw err;
    }
  }, []);

  const updateNote = useCallback(async (noteId: string, updates: Partial<Note>) => {
    try {
      const updatedNote = await noteService.updateNote(noteId, updates);
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
      setNotes(prev => prev.map(note =>
        note.id === noteId 
          ? { ...note, like_count: result.like_count }
          : note
      ));
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
          ? { ...note, view_count: note.view_count + 1 }
          : note
      ));
    } catch (err) {
      console.error('Failed to increment view count:', err);
    }
  }, []);

  // Auto-refresh notes every 30 seconds for additional real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      loadPublicNotes();
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
    createNote,
    updateNote,
    deleteNote,
    likeNote,
    incrementViewCount,
    refresh: () => loadPublicNotes()
  };
};