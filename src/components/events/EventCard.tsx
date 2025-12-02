// src/components/events/EventCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Video, Star } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { Event } from '../../types';

interface EventCardProps {
  event: Event;
  onRegister?: (eventId: string) => void;
  onUnregister?: (eventId: string) => void;
  onViewDetails?: (event: Event) => void;
  showActions?: boolean;
  isRegistered?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onRegister,
  onUnregister,
  onViewDetails,
  showActions = true,
  isRegistered = false
}) => {
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
      study_group: 'from-green-500 to-emerald-500',
      social: 'from-pink-500 to-rose-500',
      hackathon: 'from-purple-500 to-indigo-500',
      career: 'from-orange-500 to-yellow-500',
      sports: 'from-red-500 to-pink-500'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const getDifficultyBadge = (level: string) => {
    const styles: Record<string, string> = {
      beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      advanced: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      expert: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return styles[level] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const isUpcoming = new Date(event.start_time) > new Date();
  const isFull = event.max_attendees && (event.attendees_count || 0) >= event.max_attendees;
  const registrationClosed = !!(event.registration_deadline && new Date(event.registration_deadline) < new Date());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
        {/* Event Type Header */}
        <div className={`h-2 bg-gradient-to-r ${getEventColor(event.event_type)}`} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {event.title}
                </h3>
                {event.is_virtual && (
                  <Video className="h-5 w-5 text-blue-600" />
                )}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {event.description}
              </p>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{formatDateTime(event.start_time)}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">
                {event.venue_name || event.address}
                {event.is_virtual && ' (Virtual)'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Users className="h-4 w-4" />
              <span className="text-sm">
                {event.attendees_count || 0} / {event.max_attendees} participants
              </span>
            </div>

            {event.organizer_name && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Star className="h-4 w-4" />
                <span className="text-sm">by {event.organizer_name}</span>
              </div>
            )}
          </div>

          {/* Tags and Difficulty */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBadge(event.difficulty_level)}`}>
              {event.difficulty_level}
            </span>

            {event.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
              >
                #{tag}
              </span>
            ))}

            {event.tags && event.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                +{event.tags.length - 3}
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Registration Progress</span>
              <span>{Math.round(((event.attendees_count || 0) / event.max_attendees) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getEventColor(event.event_type).replace('from-', 'bg-gradient-to-r from-')}`}
                style={{
                  width: `${Math.min(((event.attendees_count || 0) / event.max_attendees) * 100, 100)}%`
                }}
              />
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                {event.price > 0 ? (
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    ₹{event.price}
                  </span>
                ) : (
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    Free
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails?.(event)}
                >
                  Details
                </Button>

                {isRegistered ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-200 text-green-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors group/btn"
                    onClick={() => onUnregister?.(event.id)}
                  >
                    <span className="group-hover/btn:hidden">Registered ✓</span>
                    <span className="hidden group-hover/btn:inline">Unregister</span>
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onRegister?.(event.id)}
                    disabled={!isUpcoming || !!isFull || registrationClosed}
                    title={
                      !isUpcoming ? 'Event has passed' :
                        isFull ? 'Event is full' :
                          registrationClosed ? 'Registration closed' :
                            'Register for event'
                    }
                  >
                    {isFull ? 'Full' : registrationClosed ? 'Closed' : 'Register'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default EventCard;