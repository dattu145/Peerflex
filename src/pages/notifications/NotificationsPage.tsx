import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Bell, Check, UserPlus, MessageCircle, Info, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { notificationService } from '../../services/notificationService';
import { connectionService } from '../../services/connectionService';
import { chatService } from '../../services/chatService';
import type { Notification } from '../../types';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPage: React.FC = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        loadNotifications();

        // Subscribe to real-time notifications
        const subscription = notificationService.subscribeToNotifications((newNotification) => {
            setNotifications(prev => [newNotification, ...prev]);
        });

        return () => {
            // Cleanup subscription if needed (though service handles it mostly)
        };
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getUserNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const handleAcceptRequest = async (notification: Notification) => {
        if (!notification.data?.requestId) return;

        try {
            setActionLoading(notification.id);
            await connectionService.acceptRequest(notification.data.requestId);

            // Create chat room
            if (notification.from_user_id) {
                await chatService.getOrCreatePrivateRoom(notification.from_user_id);
            }

            // Update notification to show it's handled (optional, or just delete it)
            await handleMarkAsRead(notification.id);

            // Refresh notifications to reflect any changes
            loadNotifications();
        } catch (error) {
            console.error('Failed to accept request:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'friend_request':
                return <UserPlus className="h-5 w-5 text-blue-500" />;
            case 'connection_accepted':
                return <Check className="h-5 w-5 text-green-500" />;
            case 'message':
                return <MessageCircle className="h-5 w-5 text-purple-500" />;
            default:
                return <Info className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Bell className="h-6 w-6 text-purple-600" />
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Notifications
                                </h1>
                                {notifications.filter(n => !n.is_read).length > 0 && (
                                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full text-sm font-medium">
                                        {notifications.filter(n => !n.is_read).length} New
                                    </span>
                                )}
                            </div>
                            {notifications.length > 0 && (
                                <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                                    Mark all as read
                                </Button>
                            )}
                        </div>

                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <div className="p-8 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p className="text-lg">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                            }`}
                                    >
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700`}>
                                                    {getIcon(notification.type)}
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {notification.title}
                                                    </p>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                    </span>
                                                </div>

                                                <p className="text-gray-600 dark:text-gray-300 mt-1">
                                                    {notification.message}
                                                </p>

                                                {notification.type === 'friend_request' && !notification.is_read && (
                                                    <div className="mt-3 flex gap-3">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleAcceptRequest(notification)}
                                                            isLoading={actionLoading === notification.id}
                                                        >
                                                            Accept Request
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => navigate(`/user/${notification.from_user_id}`)}
                                                        >
                                                            View Profile
                                                        </Button>
                                                    </div>
                                                )}

                                                {notification.type === 'connection_accepted' && (
                                                    <div className="mt-3">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                handleMarkAsRead(notification.id);
                                                                navigate('/chat');
                                                            }}
                                                        >
                                                            Start Chatting
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                {!notification.is_read && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                                                        title="Mark as read"
                                                    >
                                                        <div className="h-2 w-2 rounded-full bg-blue-600" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(notification.id)}
                                                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default NotificationsPage;
