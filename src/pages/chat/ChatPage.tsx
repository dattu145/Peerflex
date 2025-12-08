import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { MessageCircle, Search, Send, Users, Plus, UserPlus, Check, X, ArrowUpRight, Menu } from 'lucide-react';
import Button from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../hooks/useChat';
import { useConnections } from '../../hooks/useConnections';
import { useAuthStore } from '../../store/useAuthStore';
import { connectionService } from '../../services/connectionService';
import { chatService } from '../../services/chatService';
import { supabase } from '../../config/supabase';
import type { ConnectionRequest } from '../../types';

const ChatPage: React.FC = () => {


  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [activeTab, setActiveTab] = useState<'messages' | 'requests' | 'sent'>('messages');
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ConnectionRequest[]>([]);
  const [requestLoading, setRequestLoading] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();

  const {
    conversations,
    messages,
    loading,
    sendMessage,
    selectConversation,
    currentConversation
  } = useChat();

  const { connections } = useConnections();

  // Initial load and real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Load initial data
    loadPendingRequests();
    loadSentRequests();

    // Subscribe to connection_requests changes
    const requestsSubscription = supabase
      .channel('connection_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'connection_requests',
          filter: `to_user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Requests change received:', payload);
          loadPendingRequests();
        }
      )
      .subscribe();

    // Subscribe to sent requests changes
    const sentRequestsSubscription = supabase
      .channel('sent_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'connection_requests',
          filter: `from_user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Sent requests change received:', payload);
          loadSentRequests();
        }
      )
      .subscribe();

    return () => {
      requestsSubscription.unsubscribe();
      sentRequestsSubscription.unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation && activeTab === 'messages') {
      setSelectedConversation(conversations[0].id);
      selectConversation(conversations[0].id);
    }
  }, [conversations, selectConversation, activeTab]);

  const loadPendingRequests = async () => {
    try {
      const requests = await connectionService.getPendingRequests();
      setPendingRequests(requests);
    } catch (error) {
      console.error('Failed to load requests:', error);
    }
  };

  const loadSentRequests = async () => {
    try {
      const requests = await connectionService.getSentRequests();
      setSentRequests(requests);
    } catch (error) {
      console.error('Failed to load sent requests:', error);
    }
  };

  const handleAcceptRequest = async (requestId: string, fromUserId: string) => {
    try {
      setRequestLoading(requestId);
      await connectionService.acceptRequest(requestId);
      await chatService.getOrCreatePrivateRoom(fromUserId);

      setPendingRequests(prev => prev.filter(r => r.id !== requestId));

      // Switch to messages tab after accepting
      setActiveTab('messages');
    } catch (error) {
      console.error('Failed to accept request:', error);
    } finally {
      setRequestLoading(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      setRequestLoading(requestId);
      await connectionService.rejectRequest(requestId);
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (error) {
      console.error('Failed to reject request:', error);
    } finally {
      setRequestLoading(null);
    }
  };

  const handleWithdrawRequest = async (requestId: string) => {
    try {
      setRequestLoading(requestId);
      await connectionService.withdrawRequest(requestId);
      setSentRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (error) {
      console.error('Failed to withdraw request:', error);
    } finally {
      setRequestLoading(null);
    }
  };

  const handleSendMessage = async () => {
    if (messageInput.trim() && selectedConversation) {
      try {
        await sendMessage(selectedConversation, messageInput);
        setMessageInput('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    selectConversation(conversationId);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };



  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return minutes === 0 ? 'Just now' : `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading conversations...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-[calc(100vh-8rem)] sm:h-[calc(100vh-12rem)]">
            <div className="flex h-full relative">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden absolute top-3 left-3 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {/* Sidebar Overlay */}
              <AnimatePresence>
                {sidebarOpen && window.innerWidth < 768 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSidebarOpen(false)}
                    className="absolute inset-0 bg-black z-30 md:hidden"
                  />
                )}
              </AnimatePresence>

              {/* Sidebar */}
              <AnimatePresence mode="wait">
                {(sidebarOpen || window.innerWidth >= 768) && (
                  <motion.div
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                    className={`${sidebarOpen ? 'absolute inset-y-0 left-0 shadow-2xl' : 'relative'
                      } md:relative w-full sm:w-80 md:w-1/3 max-w-sm border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800 z-40 h-full`}
                  >
                    <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 pl-14 md:pl-4">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                          <span className="hidden sm:inline">Chat</span>
                        </h2>
                        <Button variant="ghost" size="sm" className="hidden sm:flex">
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Enhanced Tabs with Badges */}
                      {/* Enhanced Tabs with Badges */}
                      <div className="flex flex-wrap gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 sm:mb-4">
                        <button
                          onClick={() => setActiveTab('messages')}
                          className={`flex-1 min-w-[70px] py-1.5 px-1 sm:py-2 sm:px-3 text-[10px] xs:text-xs sm:text-sm font-medium rounded-md transition-all relative ${activeTab === 'messages'
                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                          <span className="truncate">Messages</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('requests')}
                          className={`flex-1 min-w-[70px] py-1.5 px-1 sm:py-2 sm:px-3 text-[10px] xs:text-xs sm:text-sm font-medium rounded-md transition-all relative ${activeTab === 'requests'
                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                          <span className="truncate">Requests</span>
                          {pendingRequests.length > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-red-500 text-white text-[10px] sm:text-xs flex items-center justify-center rounded-full animate-pulse">
                              {pendingRequests.length > 9 ? '9+' : pendingRequests.length}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => setActiveTab('sent')}
                          className={`flex-1 min-w-[70px] py-1.5 px-1 sm:py-2 sm:px-3 text-[10px] xs:text-xs sm:text-sm font-medium rounded-md transition-all relative ${activeTab === 'sent'
                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                          <span className="truncate">Sent</span>
                          {sentRequests.length > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-blue-500 text-white text-[10px] sm:text-xs flex items-center justify-center rounded-full">
                              {sentRequests.length > 9 ? '9+' : sentRequests.length}
                            </span>
                          )}
                        </button>
                      </div>

                      {activeTab === 'messages' && (
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      {activeTab === 'messages' ? (
                        conversations.length === 0 ? (
                          <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
                            <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-sm sm:text-base">No conversations yet</p>
                            <p className="text-xs sm:text-sm mt-2">Connect with other users to start chatting</p>
                          </div>
                        ) : (
                          conversations.map((conversation) => (
                            <motion.div
                              key={conversation.id}
                              whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                              onClick={() => handleSelectConversation(conversation.id)}
                              className={`p-3 sm:p-4 cursor-pointer border-b border-gray-200 dark:border-gray-700 ${selectedConversation === conversation.id
                                ? 'bg-blue-50 dark:bg-blue-900/20'
                                : ''
                                }`}
                            >
                              <div className="flex items-start gap-2 sm:gap-3">
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                                    {conversation.avatar}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                      {conversation.name}
                                      {conversation.type === 'group' && (
                                        <Users className="inline-block h-3 w-3 ml-1" />
                                      )}
                                    </h3>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                                      {formatTime(conversation.timestamp)}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
                                      {conversation.lastMessage || 'No messages yet'}
                                    </p>
                                    {conversation.unread > 0 && (
                                      <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full flex-shrink-0">
                                        {conversation.unread}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )
                      ) : activeTab === 'requests' ? (
                        pendingRequests.length === 0 ? (
                          <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
                            <UserPlus className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-sm sm:text-base">No pending requests</p>
                          </div>
                        ) : (
                          pendingRequests.map((request) => (
                            <motion.div
                              key={request.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -100 }}
                              className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700"
                            >
                              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                  {request.from_profile?.full_name?.substring(0, 2) || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                                    {request.from_profile?.full_name}
                                  </h3>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatTime(request.created_at)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="flex-1 text-xs sm:text-sm"
                                  onClick={() => handleAcceptRequest(request.id, request.from_user_id)}
                                  isLoading={requestLoading === request.id}
                                >
                                  <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 text-xs sm:text-sm"
                                  onClick={() => handleRejectRequest(request.id)}
                                  disabled={!!requestLoading}
                                >
                                  <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                  Decline
                                </Button>
                              </div>
                            </motion.div>
                          ))
                        )
                      ) : (
                        sentRequests.length === 0 ? (
                          <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
                            <ArrowUpRight className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-sm sm:text-base">No sent requests</p>
                          </div>
                        ) : (
                          sentRequests.map((request) => (
                            <motion.div
                              key={request.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -100 }}
                              className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700"
                            >
                              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                  {request.to_profile?.full_name?.substring(0, 2) || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                                    {request.to_profile?.full_name}
                                  </h3>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Sent {formatTime(request.created_at)}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900/50"
                                onClick={() => handleWithdrawRequest(request.id)}
                                isLoading={requestLoading === request.id}
                              >
                                <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                Withdraw Request
                              </Button>
                            </motion.div>
                          ))
                        )
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Area */}
              {activeTab === 'messages' ? (
                selectedConversation && currentConversation ? (
                  <div className="flex-1 flex flex-col">
                    <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-14 md:pl-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {currentConversation.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                            {currentConversation.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">Online</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                          <p className="text-sm sm:text-base">No messages yet</p>
                          <p className="text-xs sm:text-sm mt-2">Start the conversation!</p>
                        </div>
                      ) : (
                        messages.map((message) => {
                          const isOwnMessage = message.user_id === user?.id;
                          return (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[85%] sm:max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                                <div
                                  className={`rounded-lg px-3 py-2 sm:px-4 sm:py-2 ${isOwnMessage
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                    }`}
                                >
                                  <p className="text-xs sm:text-sm break-words">{message.content}</p>
                                </div>
                                <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'
                                  }`}>
                                  {formatTime(message.created_at)}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </div>

                    <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <div className="flex items-center gap-2">
                        <input
                          id="message-input"
                          name="message"
                          type="text"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          placeholder="Type a message..."
                          className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Button
                          variant="primary"
                          type="button"
                          onClick={handleSendMessage}
                          disabled={!messageInput.trim()}
                          className="flex-shrink-0"
                        >
                          <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                      <MessageCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-sm sm:text-base">Select a conversation to start messaging</p>
                    </div>
                  </div>
                )
              ) : activeTab === 'requests' ? (
                <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                    <UserPlus className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm sm:text-base">Manage your friend requests here</p>
                    {pendingRequests.length > 0 && (
                      <p className="text-xs sm:text-sm mt-2">You have {pendingRequests.length} pending request{pendingRequests.length !== 1 ? 's' : ''}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                    <ArrowUpRight className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm sm:text-base">View and manage sent requests</p>
                    {sentRequests.length > 0 && (
                      <p className="text-xs sm:text-sm mt-2">You have {sentRequests.length} pending request{sentRequests.length !== 1 ? 's' : ''}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;