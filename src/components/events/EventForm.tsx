// src/components/events/EventForm.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Tag, DollarSign, Video } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import LocationPicker from '../map/LocationPicker';
import type { Event, Location } from '../../types';

interface EventFormProps {
  event?: Event;
  onSubmit: (eventData: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  event,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'workshop',
    address: '',
    venue_name: '',
    start_time: '',
    end_time: '',
    max_attendees: 50,
    is_public: true,
    is_virtual: false,
    meeting_url: '',
    cover_image_url: '',
    tags: [] as string[],
    difficulty_level: 'beginner',
    price: 0,
    registration_deadline: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const eventTypes = [
    { value: 'workshop', label: 'Workshop' },
    { value: 'study_group', label: 'Study Group' },
    { value: 'social', label: 'Social' },
    { value: 'hackathon', label: 'Hackathon' },
    { value: 'career', label: 'Career' },
    { value: 'sports', label: 'Sports' }
  ];

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  // Initialize form with event data if editing
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        event_type: event.event_type,
        address: event.address,
        venue_name: event.venue_name || '',
        start_time: event.start_time.slice(0, 16), // Convert to datetime-local format
        end_time: event.end_time.slice(0, 16),
        max_attendees: event.max_attendees,
        is_public: event.is_public,
        is_virtual: event.is_virtual,
        meeting_url: event.meeting_url || '',
        cover_image_url: event.cover_image_url || '',
        tags: event.tags || [],
        difficulty_level: event.difficulty_level,
        price: event.price,
        registration_deadline: event.registration_deadline ? event.registration_deadline.slice(0, 16) : ''
      });

      if (event.location) {
        try {
          const coords = event.location.coordinates;
          setSelectedLocation({
            latitude: coords[1],
            longitude: coords[0]
          });
        } catch (error) {
          console.error('Error parsing event location:', error);
        }
      }
    }
  }, [event]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleLocationSelect = (location: Location, address?: string) => {
    setSelectedLocation(location);
    if (address) {
      handleInputChange('address', address);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.start_time) newErrors.start_time = 'Start time is required';
    if (!formData.end_time) newErrors.end_time = 'End time is required';
    if (new Date(formData.end_time) <= new Date(formData.start_time)) {
      newErrors.end_time = 'End time must be after start time';
    }
    if (!selectedLocation && !formData.is_virtual) newErrors.location = 'Location is required for in-person events';
    if (formData.is_virtual && !formData.meeting_url) newErrors.meeting_url = 'Meeting URL is required for virtual events';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const eventData = {
      ...formData,
      location: selectedLocation ? {
        type: 'Point',
        coordinates: [selectedLocation.longitude, selectedLocation.latitude]
      } : null,
      tags: formData.tags,
      price: parseFloat(formData.price.toString()) || 0,
      max_attendees: parseInt(formData.max_attendees.toString()) || 50
    };

    await onSubmit(eventData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Event Title *"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          error={errors.title}
          placeholder="Enter event title"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Event Type *
          </label>
          <select
            value={formData.event_type}
            onChange={(e) => handleInputChange('event_type', e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors duration-200"
          >
            {eventTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input
        label="Description *"
        value={formData.description}
        onChange={(e) => handleInputChange('description', e.target.value)}
        error={errors.description}
        placeholder="Describe your event..."
        as="textarea"
        rows={4}
      />

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Start Time *"
          type="datetime-local"
          value={formData.start_time}
          onChange={(e) => handleInputChange('start_time', e.target.value)}
          error={errors.start_time}
          leftIcon={<Calendar className="h-4 w-4" />}
        />

        <Input
          label="End Time *"
          type="datetime-local"
          value={formData.end_time}
          onChange={(e) => handleInputChange('end_time', e.target.value)}
          error={errors.end_time}
          leftIcon={<Clock className="h-4 w-4" />}
        />
      </div>

      <Input
        label="Registration Deadline"
        type="datetime-local"
        value={formData.registration_deadline}
        onChange={(e) => handleInputChange('registration_deadline', e.target.value)}
        leftIcon={<Calendar className="h-4 w-4" />}
      />

      {/* Virtual Event Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_virtual"
          checked={formData.is_virtual}
          onChange={(e) => handleInputChange('is_virtual', e.target.checked)}
          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
        <label htmlFor="is_virtual" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Video className="h-4 w-4" />
          This is a virtual event
        </label>
      </div>

      {/* Location or Meeting URL */}
      {formData.is_virtual ? (
        <Input
          label="Meeting URL *"
          value={formData.meeting_url}
          onChange={(e) => handleInputChange('meeting_url', e.target.value)}
          error={errors.meeting_url}
          placeholder="https://meet.google.com/xxx-xxxx-xxx"
          leftIcon={<Video className="h-4 w-4" />}
        />
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location * {errors.location && <span className="text-red-500 text-sm"> - {errors.location}</span>}
          </label>
          <LocationPicker
            initialLocation={selectedLocation || undefined}
            onLocationSelect={handleLocationSelect}
            className="h-64"
          />
          
          <Input
            label="Venue Name"
            value={formData.venue_name}
            onChange={(e) => handleInputChange('venue_name', e.target.value)}
            placeholder="e.g., University Auditorium, Coffee Shop Name"
            leftIcon={<MapPin className="h-4 w-4" />}
            className="mt-4"
          />
        </div>
      )}

      {/* Event Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Max Attendees"
          type="number"
          value={formData.max_attendees}
          onChange={(e) => handleInputChange('max_attendees', e.target.value)}
          leftIcon={<Users className="h-4 w-4" />}
          min="1"
          max="1000"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty Level
          </label>
          <select
            value={formData.difficulty_level}
            onChange={(e) => handleInputChange('difficulty_level', e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors duration-200"
          >
            {difficultyLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Price (₹)"
          type="number"
          value={formData.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
          leftIcon={<DollarSign className="h-4 w-4" />}
          min="0"
          step="0.01"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleTagAdd();
              }
            }}
            leftIcon={<Tag className="h-4 w-4" />}
            className="flex-1"
          />
          <Button type="button" onClick={handleTagAdd} variant="outline">
            Add
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleTagRemove(tag)}
                className="hover:text-purple-600 dark:hover:text-purple-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_public"
          checked={formData.is_public}
          onChange={(e) => handleInputChange('is_public', e.target.checked)}
          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
        <label htmlFor="is_public" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Make this event public
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="flex-1"
        >
          {event ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;