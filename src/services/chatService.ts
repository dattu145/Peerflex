import { supabase } from '../config/supabase';
import type { ChatRoom, Message, Conversation, Profile } from '../types';

export const chatService = {
    // Get or create private chat room between two users
    async getOrCreatePrivateRoom(otherUserId: string): Promise<ChatRoom> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Check if private room already exists
        const { data: existingRoom } = await supabase
            .from('chat_rooms')
            .select(`
        *,
        chat_members(*)
      `)
            .eq('is_group', false)
            .filter('chat_members.user_id', 'in', `(${user.id},${otherUserId})`)
            .then(({ data }) => {
                return data?.find(room =>
                    room.chat_members.length === 2 &&
                    room.chat_members.some((m: any) => m.user_id === user.id) &&
                    room.chat_members.some((m: any) => m.user_id === otherUserId)
                );
            });

        if (existingRoom) return existingRoom as ChatRoom;

        // Create new private room
        const { data: newRoom, error: roomError } = await supabase
            .from('chat_rooms')
            .insert({
                is_group: false,
                is_public: false,
                created_by: user.id
            })
            .select()
            .single();

        if (roomError) throw roomError;

        // Add both users as members
        const { error: membersError } = await supabase
            .from('chat_members')
            .insert([
                { chat_room_id: newRoom.id, user_id: user.id, role: 'member' },
                { chat_room_id: newRoom.id, user_id: otherUserId, role: 'member' }
            ]);

        if (membersError) throw membersError;

        return newRoom as ChatRoom;
    },

    // Get user's chat rooms (conversations)
    async getConversations(): Promise<Conversation[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('chat_members')
            .select(`
        chat_room:chat_rooms(
          *,
          chat_members(
            *,
            profile:profiles(*)
          ),
          messages(
            *,
            user:profiles(*)
          )
        )
      `)
            .eq('user_id', user.id)
            .order('joined_at', { ascending: false });

        if (error) throw error;

        return (data || []).map((member: any) => {
            const room = member.chat_room;
            const otherMembers = room.chat_members.filter((m: any) => m.user_id !== user.id);
            const otherUser = otherMembers[0]?.profile as Profile | undefined;

            // Get last message (most recent one)
            const lastMessage = room.messages && room.messages.length > 0 
                ? room.messages[room.messages.length - 1] 
                : null;

            return {
                id: room.id,
                type: room.is_group ? 'group' : 'direct',
                name: room.is_group ? (room.name || 'Group Chat') : (otherUser?.full_name || 'Unknown User'),
                lastMessage: lastMessage?.content,
                timestamp: lastMessage?.created_at || room.created_at,
                unread: 0,
                avatar: room.is_group ? 'GC' : (otherUser?.full_name?.substring(0, 2) || 'UU'),
                chat_room: room as ChatRoom,
                other_user: otherUser
            } as Conversation;
        });
    },

    // Get messages for a chat room
    async getMessages(chatRoomId: string, page = 0, pageSize = 50): Promise<Message[]> {
        const { data, error } = await supabase
            .from('messages')
            .select(`
        *,
        user:profiles(*),
        reply_message:messages!reply_to(*)
      `)
            .eq('chat_room_id', chatRoomId)
            .order('created_at', { ascending: false })
            .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) throw error;
        return (data || []).reverse() as Message[];
    },

    // Send a message
    async sendMessage(chatRoomId: string, content: string, messageType: 'text' | 'image' | 'file' = 'text'): Promise<Message> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('messages')
            .insert({
                chat_room_id: chatRoomId,
                user_id: user.id,
                content,
                message_type: messageType,
                read_by: [user.id]
            })
            .select(`
        *,
        user:profiles(*)
      `)
            .single();

        if (error) throw error;
        return data as Message;
    },

    // Mark messages as read
    async markAsRead(chatRoomId: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Get unread messages
        const { data: messages } = await supabase
            .from('messages')
            .select('id, read_by')
            .eq('chat_room_id', chatRoomId)
            .neq('user_id', user.id)
            .not('read_by', 'cs', `{${user.id}}`);

        if (messages && messages.length > 0) {
            for (const message of messages) {
                const updatedReadBy = [...(message.read_by || []), user.id];
                await supabase
                    .from('messages')
                    .update({ read_by: updatedReadBy })
                    .eq('id', message.id);
            }
        }
    },

    // Subscribe to new messages
    subscribeToMessages(chatRoomId: string, callback: (message: Message) => void) {
        const subscription = supabase
            .channel(`messages:${chatRoomId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `chat_room_id=eq.${chatRoomId}`
                },
                (payload) => {
                    callback(payload.new as Message);
                }
            )
            .subscribe();

        return subscription;
    },

    async subscribeToConversations(callback: () => void) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const subscription = supabase
            .channel('conversations')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'chat_members',
                    filter: `user_id=eq.${user.id}`
                },
                () => callback()
            )
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages'
                },
                () => callback()
            )
            .subscribe();

        return subscription;
    }
};