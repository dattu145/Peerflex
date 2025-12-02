// src/pages/events/EventDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Calendar, MapPin, Users, Video, ArrowLeft, Share, Bookmark, Star } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { eventService } from '../../services/eventService';
import { useEvents } from '../../hooks/useEvents';
import type { Event } from '../../types';
import { motion } from 'framer-motion';
import { UserProfileModal } from '../../components/user/UserProfileModal';

import EventAttendeesList from '../../components/events/EventAttendeesList';

const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAttendees, setShowAttendees] = useState(false);

  const { registerForEvent, cancelRegistration } = useEvents();

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) return;

      try {
        setLoading(true);
        const eventData = await eventService.getEventById(eventId);
        if (eventData) {
          setEvent(eventData);
          // Check if user is registered (you would get this from user data)
          setIsRegistered(false); // Replace with actual check
        } else {
          setError('Event not found');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  const handleRegister = async () => {
    if (!event) return;

    try {
      await registerForEvent(event.id);
      setIsRegistered(true);
      setEvent(prev => prev ? { ...prev, attendees_count: (prev.attendees_count || 0) + 1 } : null);
    } catch (err: any) {
      console.error('Failed to register:', err);
    }
  };

  const handleCancelRegistration = async () => {
    if (!event) return;

    try {
      await cancelRegistration(event.id);
      setIsRegistered(false);
      setEvent(prev => prev ? { ...prev, attendees_count: Math.max((prev.attendees_count || 0) - 1, 0) } : null);
    } catch (err: any) {
      console.error('Failed to cancel registration:', err);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffMs = eventDate.getTime() - now.getTime();

    if (diffMs <= 0) return 'Event has passed';

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays > 0) return `In ${diffDays} days`;
    if (diffHours > 0) return `In ${diffHours} hours`;
    return 'Very soon';
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading event...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error || 'Event not found'}
            </h1>
            <Button onClick={() => navigate('/events')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const isUpcoming = new Date(event.start_time) > new Date();
  const isFull = event.max_attendees && (event.attendees_count || 0) >= event.max_attendees;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/events')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            {/* Event Header */}
            <div className="relative">
              {event.cover_image_url ? (
                <img
                  src={event.cover_image_url}
                  alt={event.title}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-r from-purple-500 to-pink-500" />
              )}

              <div className="absolute inset-0 bg-black bg-opacity-40" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                <p className="text-lg opacity-90">{event.description}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Event Details */}
                  <Card>
                    <h2 className="text-xl font-semibold mb-4">Event Details</h2>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Date & Time</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {formatDateTime(event.start_time)}
                          </p>
                          <p className="text-sm text-purple-600 dark:text-purple-400">
                            {getTimeRemaining(event.start_time)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {event.venue_name || event.address}
                            {event.is_virtual && ' (Virtual Event)'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Attendees</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {event.attendees_count || 0} of {event.max_attendees} registered
                          </p>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{
                                width: `${Math.min(((event.attendees_count || 0) / event.max_attendees) * 100, 100)}%`
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {event.organizer_name && (
                        <div className="flex items-center gap-3">
                          <Star className="h-5 w-5 text-gray-400" />
                          <div
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setShowProfileModal(true)}
                          >
                            <p className="font-medium">Organizer</p>
                            <p className="text-gray-600 dark:text-gray-400">
                              {event.organizer_name}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Full Description */}
                  <Card>
                    <h2 className="text-xl font-semibold mb-4">Description</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {event.description}
                    </p>
                  </Card>

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <Card>
                      <h2 className="text-xl font-semibold mb-4">Tags</h2>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Registration Card */}
                  <Card>
                    <div className="text-center">
                      {event.price > 0 ? (
                        <div className="mb-4">
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            ₹{event.price}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Event Fee</p>
                        </div>
                      ) : (
                        <div className="mb-4">
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            FREE
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">No cost to attend</p>
                        </div>
                      )}

                      {isRegistered ? (
                        <div className="space-y-3">
                          <Button variant="outline" className="w-full border-green-200 text-green-700">
                            Registered ✓
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={handleCancelRegistration}
                            className="w-full text-red-600 hover:text-red-700"
                          >
                            Cancel Registration
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={handleRegister}
                          disabled={!isUpcoming || !!isFull}
                          className="w-full"
                        >
                          {isFull ? 'Event Full' : !isUpcoming ? 'Event Passed' : 'Register Now'}
                        </Button>
                      )}

                      <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <p>{event.attendees_count || 0} people registered</p>
                        {isUpcoming && !isFull && (
                          <p>Registration open until {formatDateTime(event.registration_deadline || event.start_time)}</p>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Event Actions */}
                  <Card>
                    <h3 className="font-semibold mb-3">Event Actions</h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setShowAttendees(true)}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        View Attendees ({event.attendees_count || 0})
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Share className="h-4 w-4 mr-2" />
                        Share Event
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save for Later
                      </Button>
                      {event.is_virtual && event.meeting_url && (
                        <Button variant="primary" className="w-full justify-start">
                          <Video className="h-4 w-4 mr-2" />
                          Join Meeting
                        </Button>
                      )}
                    </div>
                  </Card>

                  {/* Event Info */}
                  <Card>
                    <h3 className="font-semibold mb-3">Event Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Type:</span>
                        <span className="font-medium capitalize">{event.event_type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Difficulty:</span>
                        <span className="font-medium capitalize">{event.difficulty_level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                        <span className="font-medium">
                          {Math.round((new Date(event.end_time).getTime() - new Date(event.start_time).getTime()) / (1000 * 60 * 60))} hours
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {event && event.created_by && (
        <UserProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          userId={event.created_by}
          user={event.user}
        />
      )}

      {/* Attendees List Modal */}
      {event && (
        <EventAttendeesList
          eventId={event.id}
          isOpen={showAttendees}
          onClose={() => setShowAttendees(false)}
          isOrganizer={event.created_by === event.user?.id} // Assuming current user ID is available or we need to fetch it
        />
      )}
    </Layout>
  );
};

export default EventDetailPage;