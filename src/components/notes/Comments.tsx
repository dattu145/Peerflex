import React, { useState, useEffect } from 'react';
import { X, Send, Trash2, MessageCircle } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { commentService } from '../../services/commentService';
import type { NoteComment } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentsProps {
  isOpen: boolean;
  onClose: () => void;
  noteId: string;
  noteTitle: string;
  allowComments: boolean;
  onCommentAdded?: () => void;
  onCommentDeleted?: () => void;
  mode?: 'modal' | 'panel'; // Add mode prop
}

export const Comments: React.FC<CommentsProps> = ({
  isOpen,
  onClose,
  noteId,
  noteTitle,
  allowComments,
  onCommentAdded,
  onCommentDeleted,
  mode = 'modal' // Default to modal
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
      onCommentDeleted?.();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  // Load comments when component opens
  useEffect(() => {
    if (isOpen && noteId) {
      loadComments();

      const subscription = commentService.subscribeToComments(noteId, (newComment) => {
        setComments(prev => {
          const exists = prev.find(c => c.id === newComment.id);
          if (exists) {
            return prev.map(c => c.id === newComment.id ? newComment : c);
          } else {
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

  // Common content that's shared between modal and panel
  const commentsContent = (
    <>
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
    </>
  );

  // Return modal or panel based on mode
  if (mode === 'modal') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>
        <div className="p-4 min-[400px]:p-5 sm:p-6">
          {commentsContent}
        </div>
      </Modal>
    );
  }

  // Panel mode
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Comments Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full lg:w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl z-50 flex flex-col lg:top-20 lg:right-4 lg:h-[calc(100vh-6rem)] lg:rounded-lg lg:border"
          >
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Comments
                  </h2>
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full min-w-[2rem]">
                    {comments.length}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Note Title */}
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate" title={noteTitle}>
                  {noteTitle}
                </p>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4">
                {commentsLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center px-4">
                      No comments yet. Be the first to comment!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                              {comment.user?.full_name?.charAt(0) || 'U'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
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
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Comment Form */}
              {allowComments ? (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 flex-shrink-0">
                  <form onSubmit={handleAddComment}>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        disabled={loading}
                        className="flex-1 text-sm"
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading || !newComment.trim()}
                        className="flex-shrink-0 px-4 whitespace-nowrap"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 flex-shrink-0">
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Comments are disabled for this note
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};