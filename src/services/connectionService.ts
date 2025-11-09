import { supabase } from '../config/supabase';
import type { ConnectionRequest, UserConnection, Profile } from '../types';

export const connectionService = {
  // Send connection request
  async sendRequest(toUserId: string, message?: string): Promise<ConnectionRequest> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('connection_requests')
      .insert({
        from_user_id: user.id,
        to_user_id: toUserId,
        message,
        status: 'pending'
      })
      .select(`
        *,
        from_profile:profiles!from_user_id(*),
        to_profile:profiles!to_user_id(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Accept connection request
  async acceptRequest(requestId: string): Promise<void> {
    const { error } = await supabase
      .from('connection_requests')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', requestId);

    if (error) throw error;
  },

  // Reject connection request
  async rejectRequest(requestId: string): Promise<void> {
    const { error } = await supabase
      .from('connection_requests')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', requestId);

    if (error) throw error;
  },

  // Get pending requests for current user
  async getPendingRequests(): Promise<ConnectionRequest[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('connection_requests')
      .select(`
        *,
        from_profile:profiles!from_user_id(*)
      `)
      .eq('to_user_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get user's connections
  async getConnections(): Promise<UserConnection[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_connections')
      .select(`
        *,
        connected_user:profiles!connected_user_id(*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'accepted')
      .order('connected_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Check connection status with another user
  async getConnectionStatus(otherUserId: string): Promise<{
    isConnected: boolean;
    hasPendingRequest: boolean;
    requestFromMe?: boolean;
    requestId?: string;
  }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if already connected
    const { data: connection } = await supabase
      .from('user_connections')
      .select('*')
      .eq('user_id', user.id)
      .eq('connected_user_id', otherUserId)
      .eq('status', 'accepted')
      .single();

    if (connection) {
      return { isConnected: true, hasPendingRequest: false };
    }

    // Check for pending requests
    const { data: sentRequest } = await supabase
      .from('connection_requests')
      .select('*')
      .eq('from_user_id', user.id)
      .eq('to_user_id', otherUserId)
      .eq('status', 'pending')
      .single();

    if (sentRequest) {
      return { 
        isConnected: false, 
        hasPendingRequest: true, 
        requestFromMe: true,
        requestId: sentRequest.id 
      };
    }

    const { data: receivedRequest } = await supabase
      .from('connection_requests')
      .select('*')
      .eq('from_user_id', otherUserId)
      .eq('to_user_id', user.id)
      .eq('status', 'pending')
      .single();

    if (receivedRequest) {
      return { 
        isConnected: false, 
        hasPendingRequest: true, 
        requestFromMe: false,
        requestId: receivedRequest.id 
      };
    }

    return { isConnected: false, hasPendingRequest: false };
  },

  // Remove connection
  async removeConnection(connectedUserId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('user_connections')
      .delete()
      .eq('user_id', user.id)
      .eq('connected_user_id', connectedUserId);

    if (error) throw error;
  }
};