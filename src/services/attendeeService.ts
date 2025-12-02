import { supabase } from '../config/supabase';
import type { EventAttendance, Profile } from '../types';

export interface AttendeeWithProfile extends EventAttendance {
    profile?: Profile;
}

export const attendeeService = {
    // Register current user for an event
    async registerForEvent(eventId: string): Promise<EventAttendance> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Check if already registered
        const { data: existing } = await supabase
            .from('event_attendees')
            .select('*')
            .eq('event_id', eventId)
            .eq('user_id', user.id)
            .single();

        if (existing) {
            throw new Error('Already registered for this event');
        }

        // Check event capacity
        const { data: event } = await supabase
            .from('events')
            .select('max_attendees')
            .eq('id', eventId)
            .single();

        if (event?.max_attendees) {
            const { count } = await supabase
                .from('event_attendees')
                .select('*', { count: 'exact', head: true })
                .eq('event_id', eventId)
                .eq('status', 'registered');

            if (count && count >= event.max_attendees) {
                throw new Error('Event is at full capacity');
            }
        }

        const { data, error } = await supabase
            .from('event_attendees')
            .insert({
                event_id: eventId,
                user_id: user.id,
                status: 'registered'
            })
            .select('*')
            .single();

        if (error) throw error;
        return data;
    },

    // Unregister from an event
    async unregisterFromEvent(eventId: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('event_attendees')
            .delete()
            .eq('event_id', eventId)
            .eq('user_id', user.id);

        if (error) throw error;
    },

    // Get all attendees for an event with their profiles
    async getEventAttendees(eventId: string): Promise<AttendeeWithProfile[]> {
        const { data, error } = await supabase
            .from('event_attendees')
            .select(`
        *,
        profile:profiles(*)
      `)
            .eq('event_id', eventId)
            .order('registered_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Get attendee count for an event
    async getAttendeeCount(eventId: string): Promise<number> {
        const { count, error } = await supabase
            .from('event_attendees')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', eventId)
            .in('status', ['registered', 'attended']);

        if (error) throw error;
        return count || 0;
    },

    // Check in to an event (mark as attended)
    async checkInToEvent(eventId: string, userId?: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const targetUserId = userId || user.id;

        const { error } = await supabase
            .from('event_attendees')
            .update({
                status: 'attended',
                joined_at: new Date().toISOString()
            })
            .eq('event_id', eventId)
            .eq('user_id', targetUserId);

        if (error) throw error;
    },

    // Get current user's status for an event
    async getUserEventStatus(eventId: string): Promise<EventAttendance | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('event_attendees')
            .select('*')
            .eq('event_id', eventId)
            .eq('user_id', user.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
        }

        return data;
    },

    // Subscribe to attendee changes for an event
    subscribeToAttendees(
        eventId: string,
        callback: (payload: { event: 'INSERT' | 'UPDATE' | 'DELETE'; data: EventAttendance }) => void
    ) {
        const subscription = supabase
            .channel(`event_attendees:${eventId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'event_attendees',
                    filter: `event_id=eq.${eventId}`
                },
                (payload) => {
                    callback({
                        event: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
                        data: payload.new as EventAttendance
                    });
                }
            )
            .subscribe();

        return subscription;
    }
};
