import { useState, useEffect, useCallback } from 'react';
import { chatService } from '../services/chatService';
import type { Conversation, Message } from '../types';

export const useChat = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadConversations = useCallback(async (silent = false) => {
        try {
            // Only show loading spinner if we don't have data and it's not a silent update
            if (!silent && conversations.length === 0) {
                setLoading(true);
            }
            const data = await chatService.getConversations();
            setConversations(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load conversations');
        } finally {
            if (!silent) setLoading(false);
        }
    }, [conversations.length]);

    const loadMessages = useCallback(async (chatRoomId: string) => {
        try {
            const data = await chatService.getMessages(chatRoomId);
            console.log('Loaded messages:', data.length, data.map(m => m.id));
            setMessages(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load messages');
        }
    }, []);

    const selectConversation = useCallback(async (conversationId: string) => {
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation) {
            setCurrentConversation(conversation);
            await loadMessages(conversationId);
            await chatService.markAsRead(conversationId);
        }
    }, [conversations, loadMessages]); // Add loadMessages dependency

    const sendMessage = useCallback(async (chatRoomId: string, content: string) => {
        try {
            await chatService.sendMessage(chatRoomId, content);
            // We don't manually add the message here anymore because the subscription 
            // will pick it up, and we want to avoid duplicates and race conditions.
            // The subscription also handles updating the conversation list.
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send message');
            throw err;
        }
    }, []);

    // Subscribe to new messages
    useEffect(() => {
        if (!currentConversation) return;

        const subscription = chatService.subscribeToMessages(
            currentConversation.id,
            (newMessage) => {
                console.log('Subscription received message:', newMessage.id, newMessage.content);
                setMessages(prev => {
                    // Prevent duplicates - ensure we compare strings
                    const exists = prev.some(m => String(m.id) === String(newMessage.id));
                    if (exists) {
                        console.log('Duplicate message ignored:', newMessage.id);
                        return prev;
                    }
                    console.log('Adding new message from subscription:', newMessage.id);
                    return [...prev, newMessage];
                });

                // Update conversation last message
                setConversations(prev =>
                    prev.map(conv =>
                        conv.id === currentConversation.id
                            ? {
                                ...conv,
                                lastMessage: newMessage.content,
                                timestamp: newMessage.created_at
                            }
                            : conv
                    )
                );
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [currentConversation]);

    useEffect(() => {
        let subscription: any;

        const setupSubscription = async () => {
            try {
                subscription = await chatService.subscribeToConversations(() => {
                    loadConversations(true);
                });
            } catch (error) {
                console.error('Failed to subscribe to conversations:', error);
            }
        };

        setupSubscription();

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [loadConversations]);



    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    return {
        conversations,
        messages,
        currentConversation,
        loading,
        error,
        selectConversation,
        sendMessage,
        refreshConversations: loadConversations
    };
};