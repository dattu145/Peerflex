import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Search, Plus, BookOpen, Filter } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNotes } from '../../hooks/useNotes';
import { NoteCard } from '../../components/notes/NoteCard';

const NotesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const navigate = useNavigate();
  
  const { 
    notes, 
    loading, 
    error, 
    likeNote, 
    loadPublicNotes,
    refresh 
  } = useNotes();

  const subjects = [
    'All', 'Mathematics', 'Computer Science', 'Physics', 'Chemistry', 
    'Biology', 'Literature', 'History', 'Economics', 'Psychology',
    'Engineering', 'Business', 'Art', 'Music', 'Other'
  ];

  const handleSearch = () => {
    loadPublicNotes({
      subject: selectedSubject !== 'all' ? selectedSubject : undefined,
      search: searchQuery || undefined,
    });
  };

  const handleLike = async (noteId: string) => {
    try {
      await likeNote(noteId);
    } catch (error) {
      console.error('Failed to like note:', error);
    }
  };

  const handleViewNote = (noteId: string) => {
    // Navigate to note detail page (to be implemented)
    console.log('View note:', noteId);
    // navigate(`/notes/${noteId}`);
  };

  const handleCreateNote = () => {
    navigate('/notes/create');
  };

  // Apply client-side filtering for demo data or use real data
  const filteredNotes = notes.length > 0 ? notes : [
    {
      id: '1',
      title: 'Data Structures and Algorithms Cheat Sheet',
      subject: 'Computer Science',
      content: 'Complete guide to common data structures with time complexity analysis...',
      user_id: '1',
      user: {
        id: '1',
        full_name: 'John Doe',
        username: 'johndoe',
        notes_count: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      course_code: 'CS201',
      university: 'Tech University',
      tags: ['DSA', 'Algorithms', 'Interview Prep'],
      file_url: undefined,
      file_size: undefined,
      download_count: 0,
      view_count: 892,
      like_count: 145,
      is_public: true,
      is_approved: true,
      ai_summary: 'Comprehensive guide to data structures',
      difficulty_level: 3,
      rating: 4.5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Calculus Integration Formulas',
      subject: 'Mathematics',
      content: 'Essential integration formulas and techniques for exam preparation...',
      user_id: '2',
      user: {
        id: '2',
        full_name: 'Sarah Smith',
        username: 'sarahsmith',
        notes_count: 8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      course_code: 'MATH101',
      university: 'Math College',
      tags: ['Calculus', 'Integration', 'Formulas'],
      file_url: undefined,
      file_size: undefined,
      download_count: 0,
      view_count: 1245,
      like_count: 203,
      is_public: true,
      is_approved: true,
      ai_summary: 'Integration formulas and techniques',
      difficulty_level: 2,
      rating: 4.2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'React Hooks Complete Guide',
      subject: 'Computer Science',
      content: 'Deep dive into React hooks with practical examples and best practices...',
      user_id: '3',
      user: {
        id: '3',
        full_name: 'Mike Johnson',
        username: 'mikejohnson',
        notes_count: 12,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      course_code: 'CS303',
      university: 'Web Dev Institute',
      tags: ['React', 'JavaScript', 'Web Dev'],
      file_url: undefined,
      file_size: undefined,
      download_count: 0,
      view_count: 967,
      like_count: 178,
      is_public: true,
      is_approved: true,
      ai_summary: 'React hooks guide with examples',
      difficulty_level: 3,
      rating: 4.7,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];

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
              Notes Sharing Hub
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Share knowledge, learn together, and access quality notes from students worldwide
            </p>
          </motion.div>

          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search notes by title, subject, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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

            {/* Subject Filters */}
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

            {/* Search Button for Mobile */}
            <div className="flex sm:hidden justify-center">
              <Button 
                variant="secondary" 
                onClick={handleSearch}
                className="w-full"
              >
                <Search className="h-4 w-4 mr-2" />
                Search Notes
              </Button>
            </div>
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
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note, index) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onLike={handleLike}
                  onView={handleViewNote}
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
                No notes found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery || selectedSubject !== 'all' 
                  ? 'Try adjusting your search filters' 
                  : 'Be the first to share your notes with the community!'}
              </p>
              <Button variant="primary" onClick={handleCreateNote}>
                <Plus className="h-4 w-4 mr-2" />
                Share Your First Note
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotesPage;