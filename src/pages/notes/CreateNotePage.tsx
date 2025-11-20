import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { ArrowLeft, Tag, BookOpen, Globe, Lock, MessageCircle, Heart } from 'lucide-react';
import { useNotes } from '../../hooks/useNotes';
import { useNote } from '../../hooks/useNote';
import { motion } from 'framer-motion';

const CreateNotePage: React.FC = () => {
  const navigate = useNavigate();
  const { noteId } = useParams<{ noteId: string }>();
  const { createNote, updateNote, loading } = useNotes();
  const { note: existingNote, loading: noteLoading } = useNote(noteId);
  
  const isEditMode = Boolean(noteId);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subject: '',
    course_code: '',
    university: '',
    tags: [] as string[],
    is_public: true,
    allow_comments: true,
    show_likes: true,
  });
  
  const [tagInput, setTagInput] = useState('');

  const subjects = [
    'Mathematics', 'Computer Science', 'Physics', 'Chemistry', 
    'Biology', 'Literature', 'History', 'Economics', 'Psychology',
    'Engineering', 'Business', 'Art', 'Music', 'Other'
  ];

  // Pre-fill form when editing
  useEffect(() => {
    if (isEditMode && existingNote) {
      setFormData({
        title: existingNote.title || '',
        content: existingNote.content || '',
        subject: existingNote.subject || '',
        course_code: existingNote.course_code || '',
        university: existingNote.university || '',
        tags: existingNote.tags || [],
        is_public: existingNote.is_public ?? true,
        allow_comments: existingNote.allow_comments ?? true,
        show_likes: existingNote.show_likes ?? true,
      });
    }
  }, [isEditMode, existingNote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && noteId) {
        await updateNote(noteId, {
          ...formData,
          tags: formData.tags,
        });
      } else {
        await createNote({
          ...formData,
          tags: formData.tags,
        });
      }
      navigate('/notes');
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} note:`, error);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Textarea auto-resize function
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, content: e.target.value }));
    
    // Auto-resize
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 800) + 'px'; // Max height 800px
  };

  if (isEditMode && noteLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading note...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/notes')}
              className="mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Notes
            </Button>
            
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {isEditMode ? 'Edit Note' : 'Create Notes'}
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {isEditMode 
                ? 'Update your note and share it with the Peerflex community.'
                : 'Create and share your knowledge with the Peerflex community.'
              }
            </p>
          </motion.div>

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Note Title *
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter a descriptive title for your notes..."
                  required
                  className="w-full font-poppins"
                />
              </div>

              {/* Subject and Course Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-poppins"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Code
                  </label>
                  <Input
                    type="text"
                    value={formData.course_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, course_code: e.target.value }))}
                    placeholder="e.g., CS101, MATH202"
                    className="w-full font-poppins"
                  />
                </div>
              </div>

              {/* University */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  University/Institution
                  </label>
                <Input
                  type="text"
                  value={formData.university}
                  onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                  placeholder="Your university or institution name"
                  className="w-full font-poppins"
                />
              </div>

              {/* Content - IMPROVED TEXT EDITOR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Note Content *
                </label>
                <div className="relative">
                  <textarea
                    value={formData.content}
                    onChange={handleContentChange}
                    placeholder="Write your notes here... You can write thousands of lines, formatting will be preserved.

• Use bullet points for lists
• Use numbers for step-by-step instructions  
• Use **bold** for important concepts
• Use headings to organize sections

Start typing your amazing notes..."
                    required
                    rows={15}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical font-poppins text-base leading-relaxed whitespace-pre-wrap transition-all duration-200"
                    style={{ minHeight: '300px', maxHeight: '800px' }}
                  />
                  
                  {/* Character count */}
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                    {formData.content.length} characters
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Add tags to help others find your notes..."
                    className="flex-1 font-poppins"
                  />
                  <Button type="button" onClick={addTag} variant="secondary">
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-poppins"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-blue-900 dark:hover:text-blue-100 text-xs"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Privacy and Interaction Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                    Visibility
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer font-poppins">
                      <input
                        type="radio"
                        checked={formData.is_public}
                        onChange={() => setFormData(prev => ({ ...prev, is_public: true }))}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <Globe className="h-4 w-4 text-green-600" />
                      <span className="text-gray-700 dark:text-gray-300">Public</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer font-poppins">
                      <input
                        type="radio"
                        checked={!formData.is_public}
                        onChange={() => setFormData(prev => ({ ...prev, is_public: false }))}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <Lock className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700 dark:text-gray-300">Private</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                    Comments
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer font-poppins">
                      <input
                        type="radio"
                        checked={formData.allow_comments}
                        onChange={() => setFormData(prev => ({ ...prev, allow_comments: true }))}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <MessageCircle className="h-4 w-4 text-green-600" />
                      <span className="text-gray-700 dark:text-gray-300">Allow</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer font-poppins">
                      <input
                        type="radio"
                        checked={!formData.allow_comments}
                        onChange={() => setFormData(prev => ({ ...prev, allow_comments: false }))}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <MessageCircle className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700 dark:text-gray-300">Disable</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                    Likes Visibility
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer font-poppins">
                      <input
                        type="radio"
                        checked={formData.show_likes}
                        onChange={() => setFormData(prev => ({ ...prev, show_likes: true }))}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <Heart className="h-4 w-4 text-green-600" />
                      <span className="text-gray-700 dark:text-gray-300">Show</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer font-poppins">
                      <input
                        type="radio"
                        checked={!formData.show_likes}
                        onChange={() => setFormData(prev => ({ ...prev, show_likes: false }))}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <Heart className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700 dark:text-gray-300">Hide</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/notes')}
                  className="font-poppins"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading || !formData.title || !formData.content || !formData.subject}
                  className="font-poppins"
                >
                  {loading 
                    ? (isEditMode ? 'Updating...' : 'Publishing...') 
                    : (isEditMode ? 'Update Note' : 'Publish Notes')
                  }
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CreateNotePage;