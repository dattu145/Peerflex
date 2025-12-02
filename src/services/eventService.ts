import { supabase } from '../config/supabase';
import type { Event, EventAttendance, EventCategory } from '../types';
import { notificationService } from './notificationService';

export const eventService = {
  // Get all events with filters
  async getEvents(filters?: {
    eventType?: string;
    search?: string;
    limit?: number;
    page?: number;
    upcomingOnly?: boolean;
    nearLocation?: { lat: number; lng: number; radius?: number };
  }): Promise<Event[]> {
    let query = supabase
      .from('events')
      .select(`
        *,
        user:profiles(*),
        attendees:event_attendees(count)
      `)
      .eq('is_public', true)
      .order('start_time', { ascending: true });

    // Apply filters
    if (filters?.eventType && filters.eventType !== 'all') {
      query = query.eq('event_type', filters.eventType);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,tags.cs.{${filters.search}}`);
    }

    if (filters?.upcomingOnly) {
      query = query.gte('start_time', new Date().toISOString());
    }

    if (filters?.limit) {
      const page = filters.page || 0;
      query = query.range(page * filters.limit, (page + 1) * filters.limit - 1);
    }

    // Location-based filtering
    if (filters?.nearLocation) {
      const { lat, lng, radius = 10 } = filters.nearLocation;
      const { data: nearbyEvents, error } = await supabase.rpc('get_events_near_location', {
        lat,
        lng,
        radius_km: radius,
        event_types: filters.eventType && filters.eventType !== 'all' ? [filters.eventType] : null
      });

      if (error) throw error;

      // Get full event details for nearby events
      if (nearbyEvents && nearbyEvents.length > 0) {
        const eventIds = nearbyEvents.map(event => event.id);
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select(`
            *,
            user:profiles(*),
            attendees:event_attendees(count)
          `)
          .in('id', eventIds)
          .order('start_time', { ascending: true });

        if (eventsError) throw eventsError;
        return events || [];
      }
      return [];
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }

    return data || [];
  },

  // Get event by ID
  async getEventById(eventId: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        user:profiles(*),
        attendees:event_attendees(count)
      `)
      .eq('id', eventId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Create new event
  async createEvent(eventData: {
    title: string;
    description: string;
    event_type: string;
    location: any;
    address: string;
    venue_name?: string;
    start_time: string;
    end_time: string;
    max_attendees?: number;
    is_public?: boolean;
    is_virtual?: boolean;
    meeting_url?: string;
    cover_image_url?: string;
    tags?: string[];
    organizer_name?: string;
    difficulty_level?: string;
    price?: number;
    registration_deadline?: string;
  }): Promise<Event> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Fix: Proper PostGIS geography format
    let locationData = eventData.location;
    if (eventData.location && eventData.location.coordinates) {
      const [lng, lat] = eventData.location.coordinates;
      // Use proper PostGIS POINT format (longitude, latitude)
      locationData = `POINT(${lng} ${lat})`;
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        ...eventData,
        location: locationData,
        created_by: user.id,
        is_public: eventData.is_public ?? true,
        max_attendees: eventData.max_attendees || 50,
        difficulty_level: eventData.difficulty_level || 'beginner',
        price: eventData.price || 0,
      })
      .select(`
        *,
        user:profiles(*)
      `)
      .single();

    if (error) throw error;

    // Create notification
    try {
      await notificationService.createNotification({
        user_id: user.id,
        title: 'Event Created Successfully',
        message: `Your event "${data.title}" has been created successfully.`,
        type: 'system',
        data: { event_id: data.id }
      });
    } catch (notifyError) {
      console.error('Failed to create notification:', notifyError);
      // Don't throw error here, as event was created successfully
    }

    return data;
  },

  // Update event
  async updateEvent(eventId: string, updates: Partial<Event>): Promise<Event> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Verify ownership or admin rights
    const { data: existingEvent } = await supabase
      .from('events')
      .select('created_by')
      .eq('id', eventId)
      .single();

    if (!existingEvent || existingEvent.created_by !== user.id) {
      throw new Error('Not authorized to update this event');
    }

    // Fix: Proper PostGIS geography format for updates
    const updateData = { ...updates };
    if (updates.location && updates.location.coordinates) {
      const [lng, lat] = updates.location.coordinates;
      // Use proper PostGIS POINT format (longitude, latitude)
      // @ts-ignore
      updateData.location = `POINT(${lng} ${lat})`;
    }

    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', eventId)
      .select(`
        *,
        user:profiles(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Register for event
  async registerForEvent(eventId: string): Promise<EventAttendance> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if already registered
    const { data: existingAttendance } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single();

    if (existingAttendance) {
      throw new Error('Already registered for this event');
    }

    // Check event capacity
    const { data: event } = await supabase
      .from('events')
      .select('max_attendees, registered_count')
      .eq('id', eventId)
      .single();

    if (event && event.max_attendees && event.registered_count >= event.max_attendees) {
      throw new Error('Event is at full capacity');
    }

    const { data, error } = await supabase
      .from('event_attendees')
      .insert({
        event_id: eventId,
        user_id: user.id,
        status: 'registered'
      })
      .select(`
        *,
        user:profiles(*)
      `)
      .single();

    if (error) throw error;

    // Increment attendee count
    await supabase.rpc('increment_event_attendees', { event_id: eventId });

    return data;
  },

  // Cancel event registration
  async cancelRegistration(eventId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('event_attendees')
      .update({ status: 'cancelled' })
      .eq('event_id', eventId)
      .eq('user_id', user.id);

    if (error) throw error;

    // Decrement attendee count
    await supabase.rpc('decrement_event_attendees', { event_id: eventId });
  },

  // Get user's event registrations
  async getUserRegistrations(): Promise<EventAttendance[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('event_attendees')
      .select(`
        *,
        event:events(*, user:profiles(*))
      `)
      .eq('user_id', user.id)
      .order('registered_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get event categories
  async getEventCategories(): Promise<EventCategory[]> {
    const { data, error } = await supabase
      .from('event_categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  // Real-time subscription for events
  subscribeToEvents(callback: (payload: { event: 'INSERT' | 'UPDATE' | 'DELETE', data: Event | { id: string } }) => void) {
    const subscription = supabase
      .channel('public:events')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
        },
        async (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const { data } = await supabase
              .from('events')
              .select(`
                *,
                user:profiles(*),
                attendees:event_attendees(count)
              `)
              .eq('id', payload.new.id)
              .single();

            if (data) {
              callback({ event: payload.eventType, data });
            }
          } else if (payload.eventType === 'DELETE') {
            callback({ event: 'DELETE', data: { id: payload.old.id } });
          }
        }
      )
      .subscribe();

    return subscription;
  }
};