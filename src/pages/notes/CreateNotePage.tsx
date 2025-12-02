import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { ArrowLeft, Tag, BookOpen, Globe, Lock, MessageCircle, Heart, Upload, FileText, Star, Plus } from 'lucide-react';
import { useNotes } from '../../hooks/useNotes';
import { useNote } from '../../hooks/useNote';
import { noteService } from '../../services/noteService';
import { motion } from 'framer-motion';
import MDEditor from '@uiw/react-md-editor';

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
    difficulty_level: 1,
    file_url: '',
    file_size: 0,
  });

  const [tagInput, setTagInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
        difficulty_level: existingNote.difficulty_level || 1,
        file_url: existingNote.file_url || '',
        file_size: existingNote.file_size || 0,
      });
    }
  }, [isEditMode, existingNote]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const insertPageBreak = () => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + '\n\n---\n\n'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let uploadedFileUrl = formData.file_url;
      let uploadedFileSize = formData.file_size;

      if (file) {
        setUploading(true);
        const { url, size } = await noteService.uploadFile(file);
        uploadedFileUrl = url;
        uploadedFileSize = size;
        setUploading(false);
      }

      const noteData = {
        ...formData,
        tags: formData.tags,
        file_url: uploadedFileUrl,
        file_size: uploadedFileSize,
      };

      if (isEditMode && noteId) {
        await updateNote(noteId, noteData);
      } else {
        await createNote(noteData);
      }
      navigate('/notes');
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} note:`, error);
      setUploading(false);
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

              {/* Content - RICH TEXT EDITOR */}
              <div data-color-mode="auto">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Note Content *
                  </label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={insertPageBreak}
                    title="Insert a page break for book view"
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Insert Page Break
                  </Button>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  {/* Fix for cursor overlap: Ensure textarea and pre have same font settings */}
                  <style>{`
                    .w-md-editor-text-pre, .w-md-editor-text-input {
                      font-family: 'Inter', sans-serif !important;
                      font-size: 16px !important;
                      line-height: 24px !important;
                      letter-spacing: 0.5px !important; /* Added gap */
                    }
                    .w-md-editor-text-input {
                      caret-color: #2563eb; /* Blue cursor */
                    }
                  `}</style>
                  <MDEditor
                    value={formData.content}
                    onChange={(val) => setFormData(prev => ({ ...prev, content: val || '' }))}
                    height={500}
                    preview="edit"
                    className="dark:bg-gray-800"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Use the "Insert Page Break" button or type <code>---</code> to split your content into pages for the reader view.
                </p>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Attachment (PDF, Image)
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                    >
                      <Upload className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {file ? file.name : (formData.file_url ? 'Change File' : 'Click to upload a file')}
                      </span>
                    </label>
                  </div>
                  {formData.file_url && !file && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <FileText className="h-4 w-4" />
                      <span>Current file attached</span>
                    </div>
                  )}
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
                  disabled={loading || uploading || !formData.title || !formData.content || !formData.subject}
                  className="font-poppins"
                >
                  {loading || uploading
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