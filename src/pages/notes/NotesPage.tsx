import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Search, Plus, BookOpen, User, Filter, Heart, RefreshCw } from 'lucide-react';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { useNotes } from '../../hooks/useNotes';
import { NoteCard } from '../../components/notes/NoteCard';
import { useAuthStore } from '../../store/useAuthStore';

const NotesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'community' | 'my' | 'favorites'>('community');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const {
    notes,
    loading,
    error,
    likeNote,
    loadPublicNotes,
    loadUserNotes,
    loadFavoriteNotes,
    deleteNote,
    userLikedNotes,
    refresh
  } = useNotes();

  const subjects = [
    'All', 'Mathematics', 'Computer Science', 'Physics', 'Chemistry',
    'Biology', 'Literature', 'History', 'Economics', 'Psychology',
    'Engineering', 'Business', 'Art', 'Music', 'Other'
  ];

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load notes based on view mode
  useEffect(() => {
    if (viewMode === 'my') {
      loadUserNotes();
    } else if (viewMode === 'favorites') {
      loadFavoriteNotes();
    } else {
      loadPublicNotes({
        subject: selectedSubject !== 'all' ? selectedSubject : undefined,
        search: searchQuery || undefined,
      });
    }
  }, [viewMode, selectedSubject, searchQuery]);

  const handleSearch = () => {
    if (viewMode === 'my') {
      loadUserNotes();
    } else if (viewMode === 'favorites') {
      loadFavoriteNotes();
    } else {
      loadPublicNotes({
        subject: selectedSubject !== 'all' ? selectedSubject : undefined,
        search: searchQuery || undefined,
      });
    }
  };

  const handleLike = async (noteId: string) => {
    try {
      await likeNote(noteId);
    } catch (error) {
      console.error('Failed to like note:', error);
    }
  };

  const handleEditNote = (noteId: string) => {
    navigate(`/notes/edit/${noteId}`);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(noteId);
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const handleCreateNote = () => {
    navigate('/notes/create');
  };

  const getViewModeTitle = () => {
    switch (viewMode) {
      case 'my':
        return 'My Notes';
      case 'favorites':
        return 'My Favorites';
      default:
        return 'Notes Sharing Hub';
    }
  };

  const getViewModeDescription = () => {
    switch (viewMode) {
      case 'my':
        return 'Manage and view all your shared notes';
      case 'favorites':
        return 'Your favorite notes from the community';
      default:
        return 'Share knowledge, learn together, and access quality notes from students worldwide';
    }
  };

  // Filter notes based on view mode
  const filteredNotes = viewMode === 'my'
    ? notes.filter(note => note.user_id === user?.id)
    : notes;

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Hero Section - Improved Responsiveness */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 px-2">
              {getViewModeTitle()}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              {getViewModeDescription()}
            </p>
          </motion.div>

          {/* Header Section - Super Responsive */}
          <div className="mb-6 sm:mb-8">
            {/* View Mode Toggle - Stack on mobile */}
            <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex flex-col xs:flex-row gap-2 w-full">
                <div className="flex flex-col xs:flex-row gap-2 flex-1">
                  <button
                    onClick={() => setViewMode('community')}
                    className={`flex items-center justify-center gap-2 xs:gap-3 px-3 xs:px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm xs:text-base font-semibold transition-all flex-1 ${viewMode === 'community'
                      ? 'bg-blue-600 text-white shadow-lg border-2 border-blue-600'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400'
                      }`}
                  >
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="truncate">Community</span>
                  </button>
                  <button
                    onClick={() => setViewMode('my')}
                    className={`flex items-center justify-center gap-2 xs:gap-3 px-3 xs:px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm xs:text-base font-semibold transition-all flex-1 ${viewMode === 'my'
                      ? 'bg-purple-600 text-white shadow-lg border-2 border-purple-600'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-purple-400'
                      }`}
                  >
                    <User className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="truncate">My Notes</span>
                  </button>
                  <button
                    onClick={() => setViewMode('favorites')}
                    className={`flex items-center justify-center gap-2 xs:gap-3 px-3 xs:px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm xs:text-base font-semibold transition-all flex-1 ${viewMode === 'favorites'
                      ? 'bg-red-600 text-white shadow-lg border-2 border-red-600'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-red-400'
                      }`}
                  >
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="truncate">Favorites</span>
                  </button>
                </div>

                {/* Action Buttons - Icon only on mobile */}
                <div className="flex gap-2 w-full xs:w-auto">
                  <Button
                    variant="secondary"
                    className="flex-1 xs:flex-none justify-center"
                    onClick={refresh}
                    disabled={loading}
                    title="Refresh notes"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline ml-2">Refresh</span>
                  </Button>

                  <Button
                    variant="primary"
                    className="flex-1 xs:flex-none justify-center"
                    onClick={handleCreateNote}
                  >
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline ml-2">Share Notes</span>
                  </Button>
                </div>
              </div>

              {/* Filters button - only show for community view */}
              {viewMode === 'community' && (
                <div className="flex justify-center xs:justify-start">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:border-blue-400 transition-colors text-sm"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                  </button>
                </div>
              )}
            </div>

            {/* Search Bar - Improved Responsiveness */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <input
                  type="text"
                  placeholder={
                    viewMode === 'my'
                      ? "Search your notes..."
                      : viewMode === 'favorites'
                        ? "Search your favorite notes..."
                        : "Search notes by title, subject, or tags..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              {/* Search Button for Mobile */}
              <div className="flex sm:hidden">
                <Button
                  variant="secondary"
                  onClick={handleSearch}
                  className="w-full justify-center"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {viewMode === 'community' && showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 sm:mb-6"
              >
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => {
                    // FIXED: Proper active state detection for all subjects
                    const isActive = subject === 'All'
                      ? selectedSubject === 'all'
                      : selectedSubject === subject.toLowerCase();

                    return (
                      <button
                        key={subject}
                        onClick={() => {
                          const subjectValue = subject === 'All' ? 'all' : subject.toLowerCase();
                          setSelectedSubject(subjectValue);
                          loadPublicNotes({
                            subject: subject !== 'All' ? subject : undefined,
                            search: searchQuery || undefined,
                          });
                        }}
                        className={`
              px-2 xs:px-3 py-2 rounded-full text-xs xs:text-sm font-medium transition-all 
              text-center truncate border-2 relative overflow-hidden group
              ${isActive
                            ? 'bg-blue-600 text-white shadow-lg border-blue-600 transform scale-105'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700'
                          }
            `}
                      >
                        {/* Active indicator dot */}
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full shadow-sm"
                          />
                        )}

                        <span className="relative z-10">
                          {subject}
                        </span>

                        {/* Active background animation */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 bg-blue-600 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Loading notes...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8 sm:py-12">
              <div className="text-red-600 dark:text-red-400 mb-3 sm:mb-4 text-sm sm:text-base">
                Failed to load notes
              </div>
              <Button variant="primary" onClick={refresh} className="text-sm">
                Try Again
              </Button>
            </div>
          )}

          {/* Notes Grid - Super Responsive */}
          {!loading && !error && filteredNotes.length > 0 && (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onLike={handleLike}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  showActions={true}
                  isLiked={userLikedNotes.has(note.id)}
                />
              ))}
            </div>
          )}

          {/* Empty State - Responsive */}
          {!loading && !error && filteredNotes.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-base sm:text-lg">
                {viewMode === 'my'
                  ? 'You haven\'t created any notes yet'
                  : viewMode === 'favorites'
                    ? 'You haven\'t liked any notes yet'
                    : 'No notes found'
                }
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base max-w-md mx-auto px-4">
                {viewMode === 'my'
                  ? 'Start sharing your knowledge with the community!'
                  : viewMode === 'favorites'
                    ? 'Like some notes to see them here!'
                    : searchQuery || selectedSubject !== 'all'
                      ? 'Try adjusting your search filters'
                      : 'Be the first to share your notes with the community!'
                }
              </p>
              <Button variant="secondary" onClick={
                viewMode === 'favorites'
                  ? () => setViewMode('community')
                  : handleCreateNote
              } className="text-sm">
                <Plus className="h-4 w-4 mr-2" />
                {viewMode === 'my'
                  ? 'Create Your First Note'
                  : viewMode === 'favorites'
                    ? 'Browse Community Notes'
                    : 'Share Your First Note'
                }
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotesPage;