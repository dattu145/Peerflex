import { useState, useEffect, useCallback } from 'react';
import { eventService } from '../services/eventService';
import type { Event, EventAttendance } from '../types';
import { useAuthStore } from '../store/useAuthStore';

interface UseEventsProps {
  filters?: {
    eventType?: string;
    search?: string;
    upcomingOnly?: boolean;
    nearLocation?: { lat: number; lng: number; radius?: number };
  };
}

export const useEvents = (props?: UseEventsProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuthStore();

  const fetchEvents = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await eventService.getEvents(props?.filters);
      setEvents(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, props?.filters]);

  // Real-time updates
  useEffect(() => {
    if (!isAuthenticated) return;

    const subscription = eventService.subscribeToEvents((payload) => {
      if (payload.event === 'INSERT') {
        setEvents(prev => [payload.data as Event, ...prev]);
      } else if (payload.event === 'UPDATE') {
        setEvents(prev => prev.map(event => 
          event.id === (payload.data as Event).id ? payload.data as Event : event
        ));
      } else if (payload.event === 'DELETE') {
        setEvents(prev => prev.filter(event => event.id !== payload.data.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated]);

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const registerForEvent = async (eventId: string): Promise<void> => {
    try {
      await eventService.registerForEvent(eventId);
      await fetchEvents(); // Refresh events to update counts
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const cancelRegistration = async (eventId: string): Promise<void> => {
    try {
      await eventService.cancelRegistration(eventId);
      await fetchEvents(); // Refresh events to update counts
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
    registerForEvent,
    cancelRegistration
  };
};