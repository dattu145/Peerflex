import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Calendar, MapPin, Users, Clock, Plus, Video, Filter } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { motion } from 'framer-motion';

const EventsPage: React.FC = () => {
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');

  const eventTypes = ['All', 'Workshop', 'Hangout', 'Study Group', 'Hackathon', 'Social'];

  const mockEvents = [
    {
      id: '1',
      title: 'React Advanced Patterns Workshop',
      description: 'Deep dive into advanced React patterns and best practices',
      eventType: 'workshop',
      location: 'Online via Zoom',
      isVirtual: true,
      startTime: '2025-10-15T14:00:00',
      endTime: '2025-10-15T17:00:00',
      maxParticipants: 50,
      currentParticipants: 32,
      organizer: 'Tech Club',
      tags: ['React', 'JavaScript', 'Web Development']
    },
    {
      id: '2',
      title: 'Weekend Coffee Hangout',
      description: 'Casual meetup to discuss tech, projects, and make new friends',
      eventType: 'hangout',
      location: 'Starbucks, Main Street',
      isVirtual: false,
      startTime: '2025-10-12T10:00:00',
      endTime: '2025-10-12T12:00:00',
      maxParticipants: 15,
      currentParticipants: 8,
      organizer: 'Sarah Johnson',
      tags: ['Networking', 'Social', 'Coffee']
    },
    {
      id: '3',
      title: 'Data Structures Study Group',
      description: 'Weekly study session for DSA interview preparation',
      eventType: 'study-group',
      location: 'Library Room 301',
      isVirtual: false,
      startTime: '2025-10-10T18:00:00',
      endTime: '2025-10-10T20:00:00',
      maxParticipants: 20,
      currentParticipants: 15,
      organizer: 'CS Department',
      tags: ['DSA', 'Interview Prep', 'Algorithms']
    },
    {
      id: '4',
      title: 'Campus Hackathon 2025',
      description: '48-hour hackathon with amazing prizes and mentorship',
      eventType: 'hackathon',
      location: 'University Auditorium',
      isVirtual: false,
      startTime: '2025-10-20T09:00:00',
      endTime: '2025-10-22T18:00:00',
      maxParticipants: 200,
      currentParticipants: 156,
      organizer: 'University Tech Society',
      tags: ['Hackathon', 'Innovation', 'Competition']
    }
  ];

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventColor = (type: string) => {
    const colors: Record<string, string> = {
      workshop: 'from-blue-500 to-cyan-500',
      hangout: 'from-pink-500 to-rose-500',
      'study-group': 'from-green-500 to-emerald-500',
      hackathon: 'from-purple-500 to-indigo-500',
      social: 'from-orange-500 to-yellow-500'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
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

          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex flex-wrap gap-2">
                {eventTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setEventTypeFilter(type.toLowerCase())}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      eventTypeFilter === type.toLowerCase()
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-purple-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <Button variant="primary" className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap">
                <Plus className="h-5 w-5 mr-2" />
                Create Event
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className={`h-2 bg-gradient-to-r ${getEventColor(event.eventType)}`} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {event.title}
                          </h3>
                          {event.isVirtual && (
                            <Video className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {event.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{formatDateTime(event.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">
                          {event.currentParticipants} / {event.maxParticipants} participants
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        by {event.organizer}
                      </span>
                      <Button variant="primary" size="sm" className="bg-purple-600 hover:bg-purple-700">
                        Register
                      </Button>
                    </div>

                    <div className="mt-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${getEventColor(event.eventType)} h-2 rounded-full transition-all duration-300`}
                          style={{
                            width: `${(event.currentParticipants / event.maxParticipants) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventsPage;
