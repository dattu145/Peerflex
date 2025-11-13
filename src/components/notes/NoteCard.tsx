import React, { useState, useRef, useEffect } from 'react';
import { Heart, Eye, MoreVertical, MessageCircle, Trash2, Edit3 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { motion } from 'framer-motion';
import type { Note } from '../../types';
import { ConnectionRequestButton } from '../chat/ConnectionRequestButton';
import { useAuthStore } from '../../store/useAuthStore';
import { CommentsModal } from './CommentsModal';

interface NoteCardProps {
  note: Note;
  onLike?: (noteId: string) => void;
  onView?: (noteId: string) => void;
  onEdit?: (noteId: string) => void;
  onDelete?: (noteId: string) => void;
  showActions?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  onLike, 
  onView,
  onEdit,
  onDelete,
  showActions = true 
}) => {
  const { user } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = user?.id === note.user_id;
  const allowComments = note.allow_comments !== false;

  const handleLike = async () => {
    if (isLiking || !onLike) return;
    
    setIsLiking(true);
    try {
      await onLike(note.id);
    } catch (error) {
      console.error('Failed to like note:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleView = () => {
    if (onView) {
      onView(note.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(note.id);
      setShowMenu(false);
    }
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

  // Format content to preserve line breaks
  const formatContent = (content: string) => {
    return content.split('\n').slice(0, 4).join('\n');
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
        <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col min-h-[350px]">
          <div className="p-6 flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
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
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                  
                  {showMenu && (
                    <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-32">
                      <button
                        onClick={handleEdit}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Title */}
            <h3 
              className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 flex-1"
              onClick={handleView}
            >
              {note.title}
            </h3>

            {/* Content Preview */}
            <div 
              className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-1 overflow-hidden"
              onClick={handleView}
            >
              <pre className="font-sans whitespace-pre-wrap break-words line-clamp-4">
                {formatContent(note.content)}
              </pre>
            </div>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {note.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
                {note.tags.length > 3 && (
                  <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                    +{note.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-xs font-semibold">
                    {note.user?.full_name?.substring(0, 2) || 'UU'}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {note.user?.full_name || 'Unknown User'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  {note.show_likes !== false && (
                    <button 
                      onClick={handleLike}
                      disabled={isLiking}
                      className={`flex items-center gap-1 transition-colors ${
                        isLiking ? 'opacity-50' : 'hover:text-red-500'
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                      {note.like_count}
                    </button>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {note.view_count}
                  </span>
                </div>

                {/* Action Buttons */}
                {showActions && note.user && (
                  <div className="flex items-center gap-1">
                    {!isOwner && (
                      <ConnectionRequestButton 
                        targetUserId={note.user.id}
                        size="sm"
                        variant="ghost"
                        className="p-1"
                      />
                    )}
                    {allowComments && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1"
                        onClick={handleComments}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <CommentsModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        noteId={note.id}
        noteTitle={note.title}
        allowComments={allowComments}
      />
    </>
  );
};