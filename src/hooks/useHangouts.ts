import { useState, useEffect, useCallback, useRef } from 'react';
import { hangoutService } from '../services/hangoutService';
import type { HangoutSpot, HangoutCheckin } from '../types';
import { useAuthStore } from '../store/useAuthStore';

interface UseHangoutsProps {
  filters?: {
    spotType?: string;
    search?: string;
    nearLocation?: { lat: number; lng: number; radius?: number };
    hasCapacity?: boolean;
  };
}

export const useHangouts = (props?: UseHangoutsProps) => {
  const [spots, setSpots] = useState<HangoutSpot[]>([]);
  const [currentCheckin, setCurrentCheckin] = useState<HangoutCheckin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuthStore();

  const hasFetchedRef = useRef(false);
  const filtersRef = useRef(props?.filters);

  const fetchSpots = useCallback(async () => {
    // REMOVED authentication check - anyone can view spots
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching hangout spots...');
      const data = await hangoutService.getHangoutSpots(props?.filters);
      console.log('✅ Hangout spots fetched:', data.length);
      setSpots(data);
    } catch (err: any) {
      console.error('❌ Failed to fetch hangout spots:', err);
      setError(err.message);
      setSpots([]);
    } finally {
      setLoading(false);
    }
  }, [props?.filters]); // Removed isAuthenticated dependency

  const fetchCurrentCheckin = useCallback(async () => {
    // Only fetch checkins if user is authenticated
    if (!isAuthenticated) {
      setCurrentCheckin(null);
      return;
    }

    try {
      console.log('🔄 Fetching current checkin...');
      const checkin = await hangoutService.getCurrentCheckin();
      console.log('✅ Current checkin:', checkin ? 'found' : 'not found');
      setCurrentCheckin(checkin);
    } catch (err: any) {
      console.error('❌ Failed to fetch current checkin:', err);
      setCurrentCheckin(null);
    }
  }, [isAuthenticated]);

  // Reset checkin state when authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentCheckin(null);
    }
  }, [isAuthenticated]);

  // Real-time updates for spots - available to everyone
  useEffect(() => {
    console.log('🔔 Setting up spots subscription...');
    
    const subscription = hangoutService.subscribeToHangoutSpots((payload) => {
      console.log('📡 Spots subscription update:', payload.event);
      
      if (payload.event === 'INSERT') {
        setSpots(prev => [payload.data as HangoutSpot, ...prev]);
      } else if (payload.event === 'UPDATE') {
        setSpots(prev => prev.map(spot =>
          spot.id === (payload.data as HangoutSpot).id ? payload.data as HangoutSpot : spot
        ));
      } else if (payload.event === 'DELETE') {
        setSpots(prev => prev.filter(spot => spot.id !== payload.data.id));
      }
    });

    return () => {
      console.log('🔕 Cleaning up spots subscription');
      subscription.unsubscribe();
    };
  }, []); // No dependencies - available to everyone

  // Real-time updates for checkins - only for authenticated users
  useEffect(() => {
    if (!isAuthenticated) return;

    console.log('🔔 Setting up checkins subscription...');
    
    const subscription = hangoutService.subscribeToCheckins((payload) => {
      console.log('📡 Checkins subscription update:', payload.event);
      
      if (payload.event === 'INSERT' || payload.event === 'UPDATE') {
        const checkin = payload.data as HangoutCheckin;
        if (checkin.is_current) {
          setCurrentCheckin(checkin);
        } else if (currentCheckin?.id === checkin.id) {
          setCurrentCheckin(null);
        }
      } else if (payload.event === 'DELETE' && currentCheckin?.id === payload.data.id) {
        setCurrentCheckin(null);
      }
    });

    return () => {
      console.log('🔕 Cleaning up checkins subscription');
      subscription.unsubscribe();
    };
  }, [isAuthenticated, currentCheckin]);

  // Initial fetch - available to everyone
  useEffect(() => {
    if (hasFetchedRef.current) {
      return;
    }

    console.log('🎯 Initial fetch triggered');
    
    let isMounted = true;

    const initializeData = async () => {
      try {
        setLoading(true);
        await fetchSpots();
        // Only fetch checkins if authenticated
        if (isAuthenticated) {
          await fetchCurrentCheckin();
        }
        hasFetchedRef.current = true;
      } catch (err) {
        console.error('❌ Initial data fetch failed:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, fetchSpots, fetchCurrentCheckin]);

  // Refetch when filters change
  useEffect(() => {
    if (!hasFetchedRef.current) {
      return;
    }

    // Compare current filters with previous filters
    const currentFilters = JSON.stringify(props?.filters);
    const previousFilters = JSON.stringify(filtersRef.current);

    if (currentFilters !== previousFilters) {
      console.log('🔄 Filters changed, refetching spots...');
      fetchSpots();
      filtersRef.current = props?.filters;
    }
  }, [props?.filters, fetchSpots]);

  const checkIn = async (spotId: string): Promise<HangoutCheckin> => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to check in');
    }

    try {
      console.log('📍 Attempting check-in to spot:', spotId);
      const checkin = await hangoutService.checkIn(spotId);
      setCurrentCheckin(checkin);
      await fetchSpots(); // Refresh spots to update occupancy
      console.log('✅ Check-in successful');
      return checkin;
    } catch (err: any) {
      console.error('❌ Check-in failed:', err);
      throw new Error(err.message);
    }
  };

  const checkOut = async (): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to check out');
    }

    try {
      console.log('🚪 Attempting check-out');
      await hangoutService.checkOut();
      setCurrentCheckin(null);
      await fetchSpots(); // Refresh spots to update occupancy
      console.log('✅ Check-out successful');
    } catch (err: any) {
      console.error('❌ Check-out failed:', err);
      throw new Error(err.message);
    }
  };

  const refetch = useCallback(async () => {
    console.log('🔄 Manual refetch triggered');
    await fetchSpots();
    if (isAuthenticated) {
      await fetchCurrentCheckin();
    }
  }, [fetchSpots, fetchCurrentCheckin, isAuthenticated]);

  return {
    spots,
    currentCheckin,
    loading,
    error,
    refetch,
    checkIn,
    checkOut,
    refreshCheckin: fetchCurrentCheckin
  };
};