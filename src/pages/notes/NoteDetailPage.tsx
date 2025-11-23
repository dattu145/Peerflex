import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { ArrowLeft, Heart, Eye, Calendar, User, MessageCircle, X } from 'lucide-react';
import { useNote } from '../../hooks/useNote';
import { useNotes } from '../../hooks/useNotes';
import { motion, AnimatePresence } from 'framer-motion';
import { formatMarkdown } from '../../utils/markdownFormatter';
import { Comments } from '../../components/notes/Comments';

const NoteDetailPage: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const { note, loading, error, likeNote } = useNote(noteId);
  const { incrementViewCount } = useNotes();
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (note) {
      document.title = `${note.title} - Peerflex Notes`;

      // Increment view count when note is loaded (only once per user)
      const trackView = async () => {
        try {
          console.log(`Tracking view for note ${note.id} by current user`);
          await incrementViewCount(note.id);
        } catch (error) {
          console.error('Failed to track view:', error);
          // Don't throw here - we don't want to break the page if view tracking fails
        }
      };

      trackView();
    }
  }, [note, incrementViewCount]);

  const handleLike = async () => {
    if (!note) return;
    try {
      await likeNote();
    } catch (error) {
      console.error('Failed to like note:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading note...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !note) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="text-red-600 dark:text-red-400 mb-4">
                {error || 'Note not found'}
              </div>
              <Button variant="primary" onClick={() => navigate('/notes')}>
                Back to Notes
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 relative">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div
                onClick={() => navigate('/notes')}
                className="flex items-center gap-2 cursor-pointer hover:text-purple-700 dark:text-gray-300 dark:hover:text-purple-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Notes
              </div>

              {/* Comments Toggle Button */}
              <Button
                variant="primary"
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Comments</span>
                {note.comment_count > 0 && (
                  <span className="bg-white text-blue-600 rounded-full text-xs px-2 py-1 min-w-[1.5rem] text-center">
                    {note.comment_count}
                  </span>
                )}
              </Button>
            </div>

            {/* Note Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {note.title}
                  </h1>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>By {note.user?.full_name || 'Unknown User'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(note.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                        {note.subject}
                      </span>
                    </div>
                  </div>

                  {note.course_code && (
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Course: {note.course_code}
                    </p>
                  )}
                  {note.university && (
                    <p className="text-gray-600 dark:text-gray-400">
                      University: {note.university}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  {note.show_likes !== false && (
                    <button
                      onClick={handleLike}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:text-white dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                      <span className="font-semibold">{note.like_count}</span>
                    </button>
                  )}
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:text-white dark:bg-gray-700 rounded-lg">
                    <Eye className="h-5 w-5" />
                    <span className="font-semibold">{note.view_count}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Note Content with Markdown Support */}
          <Card className="p-8">
            <div
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-p:leading-relaxed prose-ul:my-3 prose-ol:my-3 prose-li:my-1 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:dark:bg-blue-900/20 prose-pre:bg-gray-100 prose-pre:dark:bg-gray-800 prose-code:bg-gray-100 prose-code:dark:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-a:text-blue-600 prose-a:dark:text-blue-400 prose-a:no-underline text-black dark:text-white hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(note.content) }}
            />
          </Card>
        </div>

        {/* Comments Panel */}
        <AnimatePresence>
          {showComments && (
            <Comments
              isOpen={showComments}
              onClose={() => setShowComments(false)}
              noteId={note.id}
              noteTitle={note.title}
              allowComments={note.allow_comments !== false}
              mode="panel" // Set panel mode
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NoteDetailPage;