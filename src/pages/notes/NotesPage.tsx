import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Search, Plus, BookOpen, User, Filter } from 'lucide-react';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { useNotes } from '../../hooks/useNotes';
import { NoteCard } from '../../components/notes/NoteCard';
import { useAuthStore } from '../../store/useAuthStore';

const NotesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [showMyNotes, setShowMyNotes] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  
  const { 
    notes, 
    loading, 
    error, 
    likeNote, 
    incrementViewCount,
    loadPublicNotes,
    loadUserNotes,
    deleteNote,
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

  // Load notes based on filter
  useEffect(() => {
    if (showMyNotes) {
      loadUserNotes();
    } else {
      loadPublicNotes({
        subject: selectedSubject !== 'all' ? selectedSubject : undefined,
        search: searchQuery || undefined,
      });
    }
  }, [showMyNotes, selectedSubject, searchQuery]);

  const handleSearch = () => {
    if (showMyNotes) {
      loadUserNotes();
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

  const handleViewNote = async (noteId: string) => {
    try {
      // Only increment view count for non-owners
      const note = notes.find(n => n.id === noteId);
      if (note && note.user_id !== user?.id) {
        await incrementViewCount(noteId);
      }
    } catch (error) {
      console.error('Failed to increment view count:', error);
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

  const toggleMyNotes = () => {
    const newShowMyNotes = !showMyNotes;
    setShowMyNotes(newShowMyNotes);
    // Reset filters when switching to My Notes
    if (newShowMyNotes) {
      setSelectedSubject('all');
      setSearchQuery('');
    }
  };

  // Filter notes for "My Notes" view
  const filteredNotes = showMyNotes 
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {showMyNotes ? 'My Notes' : 'Notes Sharing Hub'}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {showMyNotes 
                ? 'Manage and view all your shared notes' 
                : 'Share knowledge, learn together, and access quality notes from students worldwide'}
            </p>
          </motion.div>

          {/* Header Section with Toggle */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleMyNotes}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl text-base font-semibold transition-all ${
                    showMyNotes
                      ? 'bg-purple-600 text-white shadow-lg border-2 border-purple-600'
                      : 'bg-blue-600 text-white shadow-lg border-2 border-blue-600'
                  }`}
                >
                  <User className="h-5 w-5" />
                  {showMyNotes ? 'My Notes' : 'Community Notes'}
                </button>
                
                {!showMyNotes && (
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:border-blue-400 transition-colors"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </button>
                )}
              </div>

              <Button 
                variant="primary" 
                className="whitespace-nowrap"
                onClick={handleCreateNote}
              >
                <Plus className="h-5 w-5 mr-2" />
                Share Notes
              </Button>
            </div>

            {/* Search Bar - Always Visible */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder={
                    showMyNotes 
                      ? "Search your notes..." 
                      : "Search notes by title, subject, or tags..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Search Button for Mobile */}
              <div className="flex sm:hidden">
                <Button 
                  variant="secondary" 
                  onClick={handleSearch}
                  className="w-full"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Subject Filters - Only show when not in "My Notes" mode and filters are open */}
            {!showMyNotes && showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => {
                        setSelectedSubject(subject.toLowerCase());
                        loadPublicNotes({
                          subject: subject !== 'All' ? subject : undefined,
                          search: searchQuery || undefined,
                        });
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedSubject === subject.toLowerCase()
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-400'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading notes...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 dark:text-red-400 mb-4">
                Failed to load notes
              </div>
              <Button variant="primary" onClick={refresh}>
                Try Again
              </Button>
            </div>
          )}

          {/* Notes Grid */}
          {!loading && !error && filteredNotes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onLike={handleLike}
                  onView={handleViewNote}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  showActions={true}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {showMyNotes ? 'You haven\'t created any notes yet' : 'No notes found'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {showMyNotes 
                  ? 'Start sharing your knowledge with the community!' 
                  : searchQuery || selectedSubject !== 'all' 
                    ? 'Try adjusting your search filters' 
                    : 'Be the first to share your notes with the community!'}
              </p>
              <Button variant="secondary" onClick={handleCreateNote}>
                <Plus className="h-4 w-4 mr-2" />
                {showMyNotes ? 'Create Your First Note' : 'Share Your First Note'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotesPage;