import React from 'react';
import { Heart, Eye, MoreVertical, MessageCircle, Share2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { motion } from 'framer-motion';
import type { Note } from '../../types';
import { ConnectionRequestButton } from '../chat/ConnectionRequestButton';

interface NoteCardProps {
  note: Note;
  onLike?: (noteId: string) => void;
  onView?: (noteId: string) => void;
  showActions?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  onLike, 
  onView,
  showActions = true 
}) => {
  const handleLike = () => {
    if (onLike) {
      onLike(note.id);
    }
  };

  const handleView = () => {
    if (onView) {
      onView(note.id);
    }
  };

  const getDifficultyColor = (level?: number) => {
    switch (level) {
      case 1: return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 2: return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
      case 3: return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 4: return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300';
      case 5: return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getDifficultyText = (level?: number) => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Easy';
      case 3: return 'Intermediate';
      case 4: return 'Advanced';
      case 5: return 'Expert';
      default: return 'Not Rated';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(note.difficulty_level)}`}>
                {getDifficultyText(note.difficulty_level)}
              </span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                {note.subject}
              </span>
            </div>
            
            {showActions && (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="p-1">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 
            className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2"
            onClick={handleView}
          >
            {note.title}
          </h3>

          {/* Content Preview */}
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {note.content.substring(0, 150)}...
          </p>

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
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
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
                <button 
                  onClick={handleLike}
                  className="flex items-center gap-1 hover:text-red-500 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  {note.like_count}
                </button>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {note.view_count}
                </span>
              </div>

              {/* Action Buttons */}
              {showActions && note.user && (
                <div className="flex items-center gap-1">
                  <ConnectionRequestButton 
                    targetUserId={note.user.id}
                    size="sm"
                    variant="ghost"
                    className="p-1"
                  />
                  <Button variant="ghost" size="sm" className="p-1">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-1">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};