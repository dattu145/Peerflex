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
  onCommentAdded?: () => void;
  onCommentDeleted?: () => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  noteId,
  noteTitle,
  allowComments,
  onCommentAdded,
  onCommentDeleted
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
      // Notify parent component about new comment
      onCommentAdded?.();
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
      // Notify parent component about deleted comment
      onCommentDeleted?.();
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
            // New comment added
            onCommentAdded?.();
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>
      <div className="p-4 min-[400px]:p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 min-[400px]:mb-5 sm:mb-6 gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg min-[400px]:text-xl font-bold text-gray-900 dark:text-white truncate">
                Comments
              </h2>
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full min-w-[2rem]">
                {comments.length}
              </span>
            </div>
            <p className="text-xs min-[400px]:text-sm text-gray-600 dark:text-gray-400 truncate">
              {noteTitle}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="flex-shrink-0 p-1.5 min-[400px]:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X className="h-4 w-4 min-[400px]:h-5 min-[400px]:w-5" />
          </Button>
        </div>

        {/* Comments List */}
        <div className="space-y-3 min-[400px]:space-y-4 mb-4 min-[400px]:mb-5 sm:mb-6 max-h-60 min-[350px]:max-h-72 min-[400px]:max-h-80 sm:max-h-96 overflow-y-auto">
          {commentsLoading ? (
            <div className="text-center py-6 min-[400px]:py-8">
              <div className="animate-spin rounded-full h-6 w-6 min-[400px]:h-8 min-[400px]:w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-xs min-[400px]:text-sm text-gray-600 dark:text-gray-400 mt-2">
                Loading comments...
              </p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-6 min-[400px]:py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No comments yet. Be the first to comment!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 min-[400px]:p-4"
              >
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-5 h-5 min-[400px]:w-6 min-[400px]:h-6 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {comment.user?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs min-[400px]:text-sm font-medium text-gray-900 dark:text-white truncate">
                          {comment.user?.full_name || 'Unknown User'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {canDeleteComment(comment) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0 p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Trash2 className="h-3 w-3 min-[400px]:h-3.5 min-[400px]:w-3.5" />
                    </Button>
                  )}
                </div>
                <p className="text-xs min-[400px]:text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Form */}
        {allowComments ? (
          <form onSubmit={handleAddComment} className="border-t border-gray-200 dark:border-gray-700 pt-3 min-[400px]:pt-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                disabled={loading}
                className="flex-1 text-xs min-[400px]:text-sm"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !newComment.trim()}
                className="flex-shrink-0 px-3 min-[400px]:px-4 whitespace-nowrap"
              >
                <Send className="h-3 w-3 min-[400px]:h-4 min-[400px]:w-4" />
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-3 min-[400px]:py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs min-[400px]:text-sm text-gray-500 dark:text-gray-400">
              Comments are disabled for this note
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};