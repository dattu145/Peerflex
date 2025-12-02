import React, { useState, useRef, useEffect } from 'react';
import { Heart, Eye, MoreVertical, MessageCircle, Trash2, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { motion } from 'framer-motion';
import type { Note } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { Comments } from './Comments';
import { formatMarkdownPreview } from '../../utils/markdownFormatter';
import { UserProfileModal } from '../user/UserProfileModal';

interface NoteCardProps {
  note: Note;
  onLike?: (noteId: string) => void;
  onEdit?: (noteId: string) => void;
  onDelete?: (noteId: string) => void;
  showActions?: boolean;
  isLiked?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onLike,
  onEdit,
  onDelete,
  showActions = true,
  isLiked = false
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [liked, setLiked] = useState(isLiked);
  const [commentCount, setCommentCount] = useState(note.comment_count || 0);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = user?.id === note.user_id;
  const allowComments = note.allow_comments !== false;

  // Update liked state when isLiked prop changes
  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  // Update comment count when note prop changes
  useEffect(() => {
    setCommentCount(note.comment_count || 0);
  }, [note.comment_count]);

  const handleLike = async () => {
    if (isLiking || !onLike) return;

    setIsLiking(true);
    try {
      await onLike(note.id);
      setLiked(!liked);
    } catch (error) {
      console.error('Failed to like note:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleView = () => {
    navigate(`/notes/${note.id}`);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(note.id);
    } else {
      navigate(`/notes/edit/${note.id}`);
    }
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(note.id);
      setShowMenu(false);
    }
  };

  const handleComments = () => {
    setShowComments(true);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format content with markdown support for preview
  const formatContent = (content: string) => {
    const formatted = formatMarkdownPreview(content, 5); // Increased to 5 lines
    // If formatted content is empty or just the fallback, show a default message
    if (!formatted || formatted === '<em class="text-gray-400">No content</em>') {
      return '<em class="text-gray-400">Click to view content</em>';
    }
    return formatted;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col min-h-[260px] xs:min-h-[280px] sm:min-h-[300px]"> {/* Reduced min height */}
          <div className="p-4 xs:p-5 sm:p-6 flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-1 xs:mb-2"> {/* Reduced margin */}
              <div className="flex items-center gap-1 xs:gap-2">
                <span className="px-2 xs:px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium truncate max-w-[120px] xs:max-w-none">
                  {note.subject}
                </span>
              </div>

              {/* Only show three dots menu for owner */}
              {showActions && isOwner && (
                <div className="relative" ref={menuRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    <MoreVertical className="h-5 w-5 xs:h-4 xs:w-4" />
                  </Button>

                  {showMenu && (
                    <div className="absolute right-0 top-6 xs:top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-28 xs:min-w-32">
                      <button
                        onClick={handleEdit}
                        className="w-full px-3 xs:px-4 py-1 xs:py-2 text-left text-sm xs:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1 xs:gap-2"
                      >
                        <Edit3 className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={handleDelete}
                        className="w-full px-3 xs:px-4 py-1 xs:py-2 text-left text-sm xs:text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1 xs:gap-2"
                      >
                        <Trash2 className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Title - REMOVED flex-1 to prevent taking extra space */}
            <h3
              className="text-lg xs:text-xl font-bold text-gray-900 dark:text-white mb-1 xs:mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer"
              onClick={handleView}
            >
              {note.title}
            </h3>

            {/* Content Preview with Markdown Support - Improved spacing */}
            <div
              className="text-gray-600 dark:text-gray-300 text-xs xs:text-sm mb-2 xs:mb-3 flex-1 overflow-hidden cursor-pointer min-h-[60px]"
              onClick={handleView}
            >
              <div
                className="font-sans whitespace-pre-wrap break-words line-clamp-4 xs:line-clamp-5 text-xs xs:text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatContent(note.content) }}
              />
            </div>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 xs:gap-2 mb-2 xs:mb-3">
                {note.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-1 xs:px-2 py-0.5 xs:py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs truncate max-w-[80px] xs:max-w-none"
                  >
                    #{tag}
                  </span>
                ))}
                {note.tags.length > 3 && (
                  <span className="px-1 xs:px-2 py-0.5 xs:py-1 text-gray-500 dark:text-gray-400 text-xs">
                    +{note.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 xs:pt-3 border-t border-gray-200 dark:border-gray-700 mt-auto"> {/* Reduced padding */}
              {/* User Info */}
              <div className="flex items-center gap-2 xs:gap-3 min-w-0 flex-1">
                <div
                  className="flex items-center gap-1 xs:gap-2 min-w-0 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileModal(true);
                  }}
                >
                  <div className="w-6 h-6 xs:w-8 xs:h-8 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {note.user?.full_name?.substring(0, 2) || 'UU'}
                  </div>
                  <span className="text-xs xs:text-sm text-gray-600 dark:text-gray-400 truncate">
                    {note.user?.full_name || 'Unknown User'}
                  </span>
                </div>
              </div>

              {/* Stats and Actions */}
              <div className="flex items-center gap-2 xs:gap-4 flex-shrink-0 ml-2">
                {/* Stats */}
                <div className="flex items-center gap-2 xs:gap-4 text-xs xs:text-sm text-gray-500 dark:text-gray-400">
                  {note.show_likes !== false && (
                    <button
                      onClick={handleLike}
                      disabled={isLiking}
                      className={`flex items-center gap-1 transition-colors ${isLiking ? 'opacity-50' : 'hover:text-red-500'
                        } ${liked ? 'text-red-500' : ''}`}
                    >
                      <Heart
                        className={`h-3 w-3 xs:h-4 xs:w-4 ${liked ? 'fill-current' : ''}`}
                      />
                      <span className="hidden xs:inline">{note.like_count}</span>
                      <span className="xs:hidden text-xs">{note.like_count}</span>
                    </button>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3 xs:h-4 xs:w-4" />
                    <span className="hidden xs:inline">{note.view_count}</span>
                    <span className="xs:hidden text-xs">{note.view_count}</span>
                  </span>
                </div>

                {/* Action Buttons */}
                {showActions && note.user && (
                  <div className="flex items-center gap-0 xs:gap-1">
                    {allowComments && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={handleComments}
                      >
                        <div className="flex items-center gap-1 cursor-pointer">
                          <MessageCircle className="text-gray-400 h-3 w-3 xs:h-4 xs:w-4" />
                          <span className="text-gray-400 hidden xs:inline">
                            {commentCount}
                          </span>
                          <span className="text-gray-400 xs:hidden text-xs">
                            {commentCount}
                          </span>
                        </div>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <Comments
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        noteId={note.id}
        noteTitle={note.title}
        allowComments={allowComments}
        onCommentAdded={() => setCommentCount(prev => prev + 1)}
        onCommentDeleted={() => setCommentCount(prev => Math.max(0, prev - 1))}
        mode="modal" // Explicitly set modal mode
      />

      {note.user && (
        <UserProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          userId={note.user_id}
          user={note.user}
        />
      )}
    </>
  );
};