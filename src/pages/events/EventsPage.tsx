// src/pages/events/EventsPage.tsx
import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { Calendar, MapPin, Plus, Map, List, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import EventCard from '../../components/events/EventCard';
import EventsMap from '../../components/map/EventsMap';
import { useEvents } from '../../hooks/useEvents';
import { useLocation } from '../../hooks/useLocation';
import { eventService } from '../../services/eventService';
import type { Event, EventCategory } from '../../types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filters, setFilters] = useState({
    eventType: 'all',
    search: '',
    upcomingOnly: true,
    nearLocation: undefined as { lat: number; lng: number; radius: number } | undefined
  });

  const { events, loading, error, registerForEvent } = useEvents({ filters });
  const { location, requestLocation } = useLocation();

  const eventTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'study_group', label: 'Study Groups' },
    { value: 'social', label: 'Social' },
    { value: 'hackathon', label: 'Hackathons' },
    { value: 'career', label: 'Career' },
    { value: 'sports', label: 'Sports' }
  ];



  // Apply filters with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        eventType: eventTypeFilter,
        search: searchQuery,
        nearLocation: location ? { lat: location.latitude, lng: location.longitude, radius: 10 } : undefined
      }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [eventTypeFilter, searchQuery, location]);



  const handleRegister = async (eventId: string) => {
    try {
      await registerForEvent(eventId);
    } catch (error) {
      console.error('Failed to register for event:', error);
    }
  };

  const handleUseMyLocation = async () => {
    try {
      await requestLocation();
    } catch (error) {
      console.error('Failed to get location:', error);
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleViewDetails = (event: Event) => {
    // Navigate to event details page (to be implemented)
    console.log('View event details:', event.id);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <Calendar className="h-12 w-12 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Events & Hangouts
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join workshops, meetups, and connect with fellow students
            </p>
          </motion.div>

          {/* Filters and Controls */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events..."
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>

              <div className="flex gap-2">
                {/* View Mode Toggle */}
                <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                      ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'map'
                      ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                  >
                    <Map className="h-4 w-4" />
                  </button>
                </div>

                {/* Location Button */}
                <Button
                  variant="outline"
                  onClick={handleUseMyLocation}
                  className="whitespace-nowrap"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {location ? 'Update Location' : 'Use My Location'}
                </Button>

                {/* Create Event Button */}
                <Button
                  variant="primary"
                  onClick={() => navigate('/events/create')}
                  className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Event
                </Button>
              </div>
            </div>

            {/* Event Type Filters */}
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setEventTypeFilter(type.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${eventTypeFilter === type.value
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-purple-400'
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location Status */}
          {location && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">
                  Showing events near your location ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
                </span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading events...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <div className="text-center py-8">
                <p className="text-red-800 dark:text-red-400 mb-4">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </Card>
          )}

          {/* Events Content */}
          {!loading && !error && (
            <>
              {viewMode === 'list' ? (
                /* List View */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {events.length === 0 ? (
                    <div className="col-span-2 text-center py-12">
                      <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No events found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {searchQuery || eventTypeFilter !== 'all'
                          ? 'Try adjusting your filters to see more events.'
                          : 'Be the first to create an event in your area!'
                        }
                      </p>
                      <Button
                        variant="primary"
                        onClick={() => navigate('/events/create')}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Event
                      </Button>
                    </div>
                  ) : (
                    events.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onRegister={handleRegister}
                        onViewDetails={handleViewDetails}
                        isRegistered={false} // You would check this from user data
                      />
                    ))
                  )}
                </div>
              ) : (
                /* Map View */
                <EventsMap
                  events={events}
                  currentLocation={location}
                  onEventClick={handleEventClick}
                  className="mb-6"
                />
              )}
            </>
          )}

          {/* Selected Event Popup (for map view) */}
          {selectedEvent && viewMode === 'map' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full"
            >
              <Card className="bg-white dark:bg-gray-800 shadow-xl">
                <EventCard
                  event={selectedEvent}
                  onRegister={handleRegister}
                  onViewDetails={handleViewDetails}
                  showActions={true}
                />
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EventsPage;