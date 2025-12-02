import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Tag, DollarSign, Video, Plus, X, ArrowLeft } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LocationPicker from '../../components/map/LocationPicker';
import { eventService } from '../../services/eventService';
import type { Location } from '../../types';
import { motion } from 'framer-motion';

const CreateEventPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

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
        { value: 'workshop', label: 'Workshop', color: 'purple-600' },
        { value: 'study_group', label: 'Study Group', color: 'purple-600' },
        { value: 'social', label: 'Social', color: 'purple-600' },
        { value: 'hackathon', label: 'Hackathon', color: 'purple-600' },
        { value: 'career', label: 'Career', color: 'purple-600' },
        { value: 'sports', label: 'Sports', color: 'purple-600' }
    ];

    const difficultyLevels = [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
        { value: 'expert', label: 'Expert' }
    ];

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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

        setLoading(true);
        try {
            const eventData = {
                ...formData,
                start_time: new Date(formData.start_time).toISOString(),
                end_time: new Date(formData.end_time).toISOString(),
                registration_deadline: formData.registration_deadline ? new Date(formData.registration_deadline).toISOString() : undefined,
                location: selectedLocation ? {
                    type: 'Point',
                    coordinates: [selectedLocation.longitude, selectedLocation.latitude]
                } : null,
                tags: formData.tags,
                price: parseFloat(formData.price.toString()) || 0,
                max_attendees: parseInt(formData.max_attendees.toString()) || 50
            };

            await eventService.createEvent(eventData);
            navigate('/events');
        } catch (error) {
            console.error('Failed to create event:', error);
            setErrors({ submit: 'Failed to create event. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-8">
                <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 sm:mb-8"
                    >
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/events')}
                            className="mb-4 -ml-2"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Events
                        </Button>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Create New Event
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            Organize an amazing event for your community
                        </p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        {/* Event Type Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                                    Event Type
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                                    {eventTypes.map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => handleInputChange('event_type', type.value)}
                                            className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${formData.event_type === type.value
                                                ? `border-purple-500 bg-${type.color} text-white shadow-lg scale-105`
                                                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 bg-white dark:bg-gray-800'
                                                }`}
                                        >
                                            <div className={`text-xs sm:text-sm font-medium ${formData.event_type === type.value
                                                ? 'text-white'
                                                : 'text-gray-700 dark:text-gray-300'
                                                }`}>
                                                {type.label}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>

                        {/* Basic Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                                    Basic Information
                                </h2>
                                <div className="space-y-3 sm:space-y-4">
                                    <Input
                                        label="Event Title *"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        error={errors.title}
                                        placeholder="Enter an engaging title for your event"
                                    />

                                    <Input
                                        label="Description *"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        error={errors.description}
                                        placeholder="Describe what makes your event special..."
                                        as="textarea"
                                        rows={5}
                                    />
                                </div>
                            </Card>
                        </motion.div>

                        {/* Date and Time */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                                    Schedule
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
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

                                    <Input
                                        label="Registration Deadline"
                                        type="datetime-local"
                                        value={formData.registration_deadline}
                                        onChange={(e) => handleInputChange('registration_deadline', e.target.value)}
                                        leftIcon={<Calendar className="h-4 w-4" />}
                                    />
                                </div>
                            </Card>
                        </motion.div>

                        {/* Location */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="p-4 sm:p-6 pb-8">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                                    Location
                                </h2>

                                {/* Virtual Event Toggle */}
                                <div className="flex items-center gap-3 mb-4 p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="is_virtual"
                                        checked={formData.is_virtual}
                                        onChange={(e) => handleInputChange('is_virtual', e.target.checked)}
                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-4 h-4 sm:w-5 sm:h-5"
                                    />
                                    <label htmlFor="is_virtual" className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                                        <Video className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                                        This is a virtual event
                                    </label>
                                </div>

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
                                    <div className="space-y-4 sm:space-y-6">
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                                Event Location * {errors.location && <span className="text-red-500 text-sm">- {errors.location}</span>}
                                            </label>
                                            <div className="mb-6">
                                                <LocationPicker
                                                    initialLocation={selectedLocation || undefined}
                                                    onLocationSelect={handleLocationSelect}
                                                    className="rounded-lg"
                                                    showInstructions={false}
                                                />
                                            </div>
                                        </div>

                                        <Input
                                            label="Venue Name"
                                            value={formData.venue_name}
                                            onChange={(e) => handleInputChange('venue_name', e.target.value)}
                                            placeholder="e.g., University Auditorium, Coffee Shop Name"
                                            leftIcon={<MapPin className="h-4 w-4" />}
                                        />
                                    </div>
                                )}
                            </Card>
                        </motion.div>

                        {/* Event Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Card className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                                    Event Details
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors duration-200"
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
                            </Card>
                        </motion.div>

                        {/* Tags */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Card className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                                    Tags
                                </h2>
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Input
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            placeholder="Add a tag (e.g., networking, coding, fun)..."
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleTagAdd();
                                                }
                                            }}
                                            leftIcon={<Tag className="h-4 w-4" />}
                                            className="flex-1"
                                        />
                                        <Button type="button" onClick={handleTagAdd} variant="outline" className="flex-shrink-0 w-full sm:w-auto">
                                            <Plus className="h-4 w-4 mr-1" />
                                            Add Tag
                                        </Button>
                                    </div>

                                    {formData.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.tags.map((tag) => (
                                                <motion.span
                                                    key={tag}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs sm:text-sm font-medium shadow-md"
                                                >
                                                    #{tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleTagRemove(tag)}
                                                        className="hover:bg-white/20 rounded-full p-0.5 sm:p-1 transition-colors"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </motion.span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </motion.div>

                        {/* Additional Options */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <Card className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                                    Visibility
                                </h2>
                                <div className="flex items-center gap-3 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="is_public"
                                        checked={formData.is_public}
                                        onChange={(e) => handleInputChange('is_public', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 sm:w-5 sm:h-5"
                                    />
                                    <label htmlFor="is_public" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                                        Make this event public (visible to all users)
                                    </label>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Error Message */}
                        {errors.submit && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                            >
                                <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm">{errors.submit}</p>
                            </motion.div>
                        )}

                        {/* Form Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 pb-4"
                        >
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/events')}
                                className="w-full sm:flex-1"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={loading}
                                className="w-full sm:flex-1"
                            >
                                Create Event
                            </Button>
                        </motion.div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default CreateEventPage;
