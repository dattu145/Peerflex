import React, { useState, useEffect } from 'react';
import { Users, X, Check, Clock, MessageCircle, UserPlus } from 'lucide-react';
import { attendeeService, type AttendeeWithProfile } from '../../services/attendeeService';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { UserProfileModal } from '../user/UserProfileModal';
import { motion, AnimatePresence } from 'framer-motion';

interface EventAttendeesListProps {
    eventId: string;
    isOpen: boolean;
    onClose: () => void;
    isOrganizer?: boolean;
}

const EventAttendeesList: React.FC<EventAttendeesListProps> = ({
    eventId,
    isOpen,
    onClose,
    isOrganizer = false
}) => {
    const [attendees, setAttendees] = useState<AttendeeWithProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [checkingIn, setCheckingIn] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadAttendees();

            // Subscribe to real-time updates
            const subscription = attendeeService.subscribeToAttendees(eventId, () => {
                loadAttendees();
            });

            return () => {
                subscription.unsubscribe();
            };
        }
    }, [eventId, isOpen]);

    const loadAttendees = async () => {
        try {
            setLoading(true);
            const data = await attendeeService.getEventAttendees(eventId);
            setAttendees(data);
        } catch (error) {
            console.error('Failed to load attendees:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async (userId: string) => {
        try {
            setCheckingIn(userId);
            await attendeeService.checkInToEvent(eventId, userId);
            await loadAttendees();
        } catch (error) {
            console.error('Failed to check in:', error);
        } finally {
            setCheckingIn(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'attended':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                        <Check className="h-3 w-3" />
                        Attended
                    </span>
                );
            case 'registered':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                        <Clock className="h-3 w-3" />
                        Registered
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 rounded-full text-xs font-medium">
                        <X className="h-3 w-3" />
                        Cancelled
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Event Attendees" size="lg">
                <div className="space-y-4">
                    {/* Stats */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>{attendees.length} {attendees.length === 1 ? 'person' : 'people'} registered</span>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                            <p className="text-sm text-gray-500 mt-2">Loading attendees...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && attendees.length === 0 && (
                        <div className="text-center py-8">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 dark:text-gray-400">No attendees yet</p>
                        </div>
                    )}

                    {/* Attendees List */}
                    {!loading && attendees.length > 0 && (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            <AnimatePresence>
                                {attendees.map((attendee) => (
                                    <motion.div
                                        key={attendee.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            {/* Avatar */}
                                            <button
                                                onClick={() => setSelectedUserId(attendee.user_id)}
                                                className="flex-shrink-0 hover:opacity-80 transition-opacity"
                                            >
                                                {attendee.profile?.avatar_url ? (
                                                    <img
                                                        src={attendee.profile.avatar_url}
                                                        alt={attendee.profile.full_name}
                                                        className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-500"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold ring-2 ring-purple-500">
                                                        {attendee.profile?.full_name?.charAt(0) || '?'}
                                                    </div>
                                                )}
                                            </button>

                                            {/* User Info */}
                                            <div className="flex-1 min-w-0">
                                                <button
                                                    onClick={() => setSelectedUserId(attendee.user_id)}
                                                    className="text-left hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                                >
                                                    <p className="font-medium text-gray-900 dark:text-white truncate">
                                                        {attendee.profile?.full_name || 'Unknown User'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        Registered {new Date(attendee.registered_at).toLocaleDateString()}
                                                    </p>
                                                </button>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="flex-shrink-0">
                                                {getStatusBadge(attendee.status)}
                                            </div>
                                        </div>

                                        {/* Check-in Button (Organizer Only) */}
                                        {isOrganizer && attendee.status === 'registered' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCheckIn(attendee.user_id)}
                                                loading={checkingIn === attendee.user_id}
                                                className="ml-2 flex-shrink-0"
                                            >
                                                <Check className="h-4 w-4 mr-1" />
                                                Check In
                                            </Button>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </Modal>

            {/* User Profile Modal */}
            {selectedUserId && (
                <UserProfileModal
                    userId={selectedUserId}
                    isOpen={!!selectedUserId}
                    onClose={() => setSelectedUserId(null)}
                />
            )}
        </>
    );
};

export default EventAttendeesList;
