import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { MessageCircle, Search, Send, Users, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

const ChatPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [messageInput, setMessageInput] = useState('');

  const mockConversations = [
    {
      id: '1',
      type: 'direct',
      name: 'Sarah Johnson',
      lastMessage: 'Hey, did you get the notes?',
      timestamp: '2m ago',
      unread: 2,
      avatar: 'SJ'
    },
    {
      id: '2',
      type: 'group',
      name: 'CS Study Group',
      lastMessage: 'Meeting at 3 PM today',
      timestamp: '15m ago',
      unread: 5,
      avatar: 'CS'
    },
    {
      id: '3',
      type: 'direct',
      name: 'Mike Davis',
      lastMessage: 'Thanks for the help!',
      timestamp: '1h ago',
      unread: 0,
      avatar: 'MD'
    }
  ];

  const mockMessages = [
    {
      id: '1',
      sender: 'Sarah Johnson',
      content: 'Hey, did you get the notes?',
      timestamp: '2m ago',
      isOwn: false
    },
    {
      id: '2',
      sender: 'You',
      content: 'Yes! Just finished reading them. Really helpful!',
      timestamp: '1m ago',
      isOwn: true
    },
    {
      id: '3',
      sender: 'Sarah Johnson',
      content: 'Great! Let me know if you need any clarification',
      timestamp: 'Just now',
      isOwn: false
    }
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-[calc(100vh-12rem)]">
            <div className="flex h-full">
              <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <MessageCircle className="h-6 w-6 text-blue-600" />
                      Messages
                    </h2>
                    <Button variant="ghost" size="sm">
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {mockConversations.map((conversation) => (
                    <motion.div
                      key={conversation.id}
                      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`p-4 cursor-pointer border-b border-gray-200 dark:border-gray-700 ${
                        selectedConversation === conversation.id
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-semibold">
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
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {conversation.timestamp}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                              {conversation.lastMessage}
                            </p>
                            {conversation.unread > 0 && (
                              <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {selectedConversation ? (
                <div className="hidden md:flex flex-1 flex-col">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-semibold">
                        SJ
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Sarah Johnson</h3>
                        <p className="text-sm text-green-600 dark:text-green-400">Online</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {mockMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              message.isOwn
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${message.isOwn ? 'text-right' : 'text-left'}`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Button variant="primary" onClick={handleSendMessage}>
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Select a conversation to start messaging</p>
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
