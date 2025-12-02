import React, { useState, useEffect } from 'react';
import { BookOpen, MessageCircle, UserPlus, Check, Shield } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { connectionService } from '../../services/connectionService';
import { chatService } from '../../services/chatService';
import { notificationService } from '../../services/notificationService';
import { useAuthStore } from '../../store/useAuthStore';
import type { Profile } from '../../types';
import { useNavigate } from 'react-router-dom';

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    user?: Profile; // Optional pre-loaded user data
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
    isOpen,
    onClose,
    userId,
    user: initialUser
}) => {
    const navigate = useNavigate();
    const { user: currentUser, profile: currentProfile } = useAuthStore();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [profile, setProfile] = useState<Profile | null>(initialUser || null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState(!initialUser);
    const [connectionStatus, setConnectionStatus] = useState<{
        isConnected: boolean;
        hasPendingRequest: boolean;
        requestFromMe?: boolean;
        requestId?: string;
    }>({ isConnected: false, hasPendingRequest: false });
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (isOpen && userId) {
            loadData();
        }
    }, [isOpen, userId]);

    const loadData = async () => {
        try {
            setLoading(true);

            // Load connection status
            if (currentUser && currentUser.id !== userId) {
                const status = await connectionService.getConnectionStatus(userId);
                setConnectionStatus(status);
            }

            // If we don't have profile data, we might need to fetch it (assuming we have a service for it)
            // For now, we rely on the passed user object or basic info if available
            // In a real app, you'd fetch the full profile here if initialUser is partial

        } catch (error) {
            console.error('Failed to load user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendRequest = async () => {
        if (!currentUser) return;

        try {
            setActionLoading(true);
            await connectionService.sendRequest(userId);

            // Send notification
            await notificationService.createNotification({
                user_id: userId,
                title: 'New Friend Request',
                message: `${currentProfile?.full_name || 'Someone'} sent you a friend request`,
                type: 'friend_request',
                from_user_id: currentUser.id
            });

            setConnectionStatus({
                isConnected: false,
                hasPendingRequest: true,
                requestFromMe: true
            });
        } catch (error) {
            console.error('Failed to send request:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleAcceptRequest = async () => {
        if (!connectionStatus.requestId) return;

        try {
            setActionLoading(true);
            await connectionService.acceptRequest(connectionStatus.requestId);

            // Notify the sender
            await notificationService.createNotification({
                user_id: userId,
                title: 'Friend Request Accepted',
                message: `${currentProfile?.full_name || 'Someone'} accepted your friend request`,
                type: 'connection_accepted',
                from_user_id: currentUser?.id
            });

            setConnectionStatus({
                isConnected: true,
                hasPendingRequest: false
            });
        } catch (error) {
            console.error('Failed to accept request:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleMessage = async () => {
        try {
            setActionLoading(true);
            const room = await chatService.getOrCreatePrivateRoom(userId);
            onClose();
            navigate(`/chat?room=${room.id}`);
        } catch (error) {
            console.error('Failed to start chat:', error);
        } finally {
            setActionLoading(false);
        }
    };

    if (!profile && !initialUser) return null;

    const displayUser = profile || initialUser!;
    const isMe = currentUser?.id === userId;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="User Profile">
            <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                    {displayUser.avatar_url ? (
                        <img
                            src={displayUser.avatar_url}
                            alt={displayUser.full_name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        displayUser.full_name?.substring(0, 2).toUpperCase() || 'U'
                    )}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {displayUser.full_name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                    @{displayUser.username || 'username'}
                </p>

                {/* Stats/Info Grid */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 mb-1">
                            <BookOpen className="h-4 w-4" />
                            <span className="text-sm font-medium">Notes</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {displayUser.notes_count || 0}
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 mb-1">
                            <Shield className="h-4 w-4" />
                            <span className="text-sm font-medium">Reputation</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {displayUser.reputation_score || 0}
                        </p>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="w-full space-y-3 mb-8 text-left">
                    {displayUser.university && (
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                <BookOpen className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">University</p>
                                <p className="font-medium">{displayUser.university}</p>
                            </div>
                        </div>
                    )}

                    {displayUser.major && (
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                <BookOpen className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Major</p>
                                <p className="font-medium">{displayUser.major}</p>
                            </div>
                        </div>
                    )}

                    {displayUser.bio && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                            <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                                "{displayUser.bio}"
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                {!isMe && (
                    <div className="flex gap-3 w-full">
                        {connectionStatus.isConnected ? (
                            <Button
                                className="flex-1"
                                onClick={handleMessage}
                                isLoading={actionLoading}
                            >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Message
                            </Button>
                        ) : connectionStatus.hasPendingRequest ? (
                            connectionStatus.requestFromMe ? (
                                <Button
                                    className="flex-1"
                                    variant="secondary"
                                    disabled
                                >
                                    <Check className="h-4 w-4 mr-2" />
                                    Request Sent
                                </Button>
                            ) : (
                                <div className="flex gap-2 flex-1">
                                    <Button
                                        className="flex-1"
                                        onClick={handleAcceptRequest}
                                        isLoading={actionLoading}
                                    >
                                        <Check className="h-4 w-4 mr-2" />
                                        Accept
                                    </Button>
                                    {/* Reject button could be added here */}
                                </div>
                            )
                        ) : (
                            <Button
                                className="flex-1"
                                onClick={handleSendRequest}
                                isLoading={actionLoading}
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add Friend
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
};
