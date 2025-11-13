import React, { useState, useEffect } from 'react';
import { X, Send, Trash2 } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { commentService } from '../../services/commentService';
import type { NoteComment } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteId: string;
  noteTitle: string;
  allowComments: boolean;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  noteId,
  noteTitle,
  allowComments
}) => {
  const [comments, setComments] = useState<NoteComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const { user } = useAuthStore();

  const loadComments = async () => {
    try {
      setCommentsLoading(true);
      const data = await commentService.getNoteComments(noteId);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || loading) return;

    try {
      setLoading(true);
      const comment = await commentService.addComment(noteId, newComment.trim());
      setComments(prev => [...prev, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentService.deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  // Load comments when modal opens
  useEffect(() => {
    if (isOpen) {
      loadComments();
      
      // Subscribe to real-time comments
      const subscription = commentService.subscribeToComments(noteId, (newComment) => {
        setComments(prev => {
          const exists = prev.find(c => c.id === newComment.id);
          if (exists) {
            return prev.map(c => c.id === newComment.id ? newComment : c);
          } else {
            return [...prev, newComment];
          }
        });
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isOpen, noteId]);

  const canDeleteComment = (comment: NoteComment) => {
    return user?.id === comment.user_id || user?.id === comment.user?.id;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Comments
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {noteTitle}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Comments List */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {commentsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No comments yet. Be the first to comment!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-xs font-semibold">
                      {comment.user?.full_name?.substring(0, 2) || 'UU'}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {comment.user?.full_name || 'Unknown User'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {canDeleteComment(comment) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Form */}
        {allowComments ? (
          <form onSubmit={handleAddComment} className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                disabled={loading}
                className="flex-1"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !newComment.trim()}
                className="whitespace-nowrap"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Comments are disabled for this note
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};