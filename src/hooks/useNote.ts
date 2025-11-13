import { useState, useEffect, useCallback } from 'react';
import { noteService } from '../services/noteService';
import type { Note } from '../types';

export const useNote = (noteId?: string) => {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNote = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const noteData = await noteService.getNoteById(id);
      setNote(noteData);
      setError(null);
      
      // Increment view count when note is loaded
      if (noteData) {
        await noteService.incrementViewCount(id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load note');
    } finally {
      setLoading(false);
    }
  }, []);

  const likeNote = useCallback(async () => {
    if (!note) return;
    
    try {
      const result = await noteService.toggleLike(note.id);
      setNote(prev => prev ? { ...prev, like_count: result.like_count } : null);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like note');
      throw err;
    }
  }, [note]);

  const updateNote = useCallback(async (updates: Partial<Note>) => {
    if (!note) return;
    
    try {
      const updatedNote = await noteService.updateNote(note.id, updates);
      setNote(updatedNote);
      return updatedNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
      throw err;
    }
  }, [note]);

  const deleteNote = useCallback(async () => {
    if (!note) return;
    
    try {
      await noteService.deleteNote(note.id);
      setNote(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
      throw err;
    }
  }, [note]);

  useEffect(() => {
    if (noteId) {
      loadNote(noteId);
    } else {
      setLoading(false);
      setNote(null);
    }
  }, [noteId, loadNote]);

  return {
    note,
    loading,
    error,
    likeNote,
    updateNote,
    deleteNote,
    refresh: () => noteId ? loadNote(noteId) : Promise.resolve()
  };
};