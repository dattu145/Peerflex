import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { ArrowLeft, Heart, Eye, Calendar, User } from 'lucide-react';
import { useNote } from '../../hooks/useNote';
import { motion } from 'framer-motion';

const NoteDetailPage: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const { note, loading, error, likeNote } = useNote(noteId);

  useEffect(() => {
    if (note) {
      document.title = `${note.title} - Peerflex Notes`;
    }
  }, [note]);

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
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading note...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !note) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/notes')}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Notes
            </Button>

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
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                      <span className="font-semibold">{note.like_count}</span>
                    </button>
                  )}
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
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

          {/* Note Content */}
          <Card className="p-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <pre className="font-sans whitespace-pre-wrap break-words text-gray-900 dark:text-gray-100 leading-relaxed text-base">
                {note.content}
              </pre>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default NoteDetailPage;