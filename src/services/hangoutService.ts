import { supabase } from '../config/supabase';
import type { HangoutSpot, HangoutCheckin, HangoutSpotReview, Location } from '../types';

export const hangoutService = {
  // Get hangout spots with filters
  async getHangoutSpots(filters?: {
    spotType?: string;
    search?: string;
    nearLocation?: { lat: number; lng: number; radius?: number };
    hasCapacity?: boolean;
    limit?: number;
    page?: number;
  }): Promise<HangoutSpot[]> {

    // If no location filter or RPC function might not work, use basic query
    if (!filters?.nearLocation) {
      return await this.getHangoutSpotsBasic(filters);
    }

    const { lat, lng, radius = 5 } = filters.nearLocation;

    try {
      const { data: nearbySpots, error } = await supabase.rpc('get_hangout_spots_near_location', {
        lat,
        lng,
        radius_km: radius,
        spot_types: filters.spotType && filters.spotType !== 'all' ? [filters.spotType] : null
      });

      if (error) {
        console.warn('RPC function not available, falling back to basic query:', error);
        return await this.getHangoutSpotsBasic(filters);
      }

      if (nearbySpots && nearbySpots.length > 0) {
        const spotIds = nearbySpots.map((spot: any) => spot.id);
        const { data: spots, error: spotsError } = await supabase
          .from('hangout_spots')
          .select(`
          *,
          user:profiles(*)
        `)
          .in('id', spotIds)
          .eq('is_active', true);

        if (spotsError) throw spotsError;

        let filteredSpots = spots || [];

        // Apply additional filters
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          filteredSpots = filteredSpots.filter(spot =>
            spot.name.toLowerCase().includes(searchLower) ||
            spot.description?.toLowerCase().includes(searchLower) ||
            spot.address?.toLowerCase().includes(searchLower)
          );
        }

        if (filters?.hasCapacity) {
          filteredSpots = filteredSpots.filter(spot =>
            spot.current_occupancy < spot.capacity
          );
        }

        // Add distance information
        filteredSpots = filteredSpots.map(spot => {
          const nearbySpot = nearbySpots.find((ns: any) => ns.id === spot.id);
          return {
            ...spot,
            distance: nearbySpot?.distance_meters
          };
        });

        // Sort by distance
        filteredSpots.sort((a, b) => (a.distance || 0) - (b.distance || 0));

        return filteredSpots;
      }
      return [];

    } catch (error) {
      console.warn('Location-based query failed, falling back to basic query:', error);
      return await this.getHangoutSpotsBasic(filters);
    }
  },

  // Basic query without location filtering
  async getHangoutSpotsBasic(filters?: {
    spotType?: string;
    search?: string;
    hasCapacity?: boolean;
    limit?: number;
    page?: number;
  }): Promise<HangoutSpot[]> {
    let query = supabase
      .from('hangout_spots')
      .select(`
        *,
        user:profiles(*)
      `)
      .eq('is_active', true)
      .order('name', { ascending: true });

    // Apply filters
    if (filters?.spotType && filters.spotType !== 'all') {
      query = query.eq('spot_type', filters.spotType);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
    }

    if (filters?.limit) {
      const page = filters.page || 0;
      query = query.range(page * filters.limit, (page + 1) * filters.limit - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching hangout spots:', error);
      throw error;
    }

    // Apply client-side filters
    let filteredData = data || [];

    // Apply hasCapacity filter client-side
    if (filters?.hasCapacity) {
      filteredData = filteredData.filter(spot => spot.current_occupancy < spot.capacity);
    }

    return filteredData;
  },

  async getHangoutSpot(spotId: string): Promise<HangoutSpot> {
    try {
      const { data, error } = await supabase
        .from('hangout_spots')
        .select(`
        *,
        user:profiles(*)
      `)
        .eq('id', spotId)
        .single();

      if (error) {
        console.error('Error fetching hangout spot:', error);
        throw new Error(error.message || 'Failed to fetch hangout spot');
      }

      if (!data) {
        throw new Error('Hangout spot not found');
      }

      return data;
    } catch (error) {
      console.error('Error in getHangoutSpot:', error);
      throw error;
    }
  },

  // Get hangout spot by ID
  async getHangoutSpotById(spotId: string): Promise<HangoutSpot | null> {
    const { data, error } = await supabase
      .from('hangout_spots')
      .select(`
        *,
        user:profiles(*)
      `)
      .eq('id', spotId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  async createHangoutSpot(spotData: {
    name: string;
    description: string;
    location: any;
    address: string;
    spot_type: string;
    capacity?: number;
    amenities?: string[];
    operating_hours?: any;
    contact_info?: any;
    images?: string[];
  }): Promise<HangoutSpot> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Fix: Proper PostGIS geography format
    let locationData = null;
    if (spotData.location && spotData.location.coordinates) {
      const [lng, lat] = spotData.location.coordinates;
      // Use proper PostGIS POINT format (longitude, latitude)
      locationData = `POINT(${lng} ${lat})`;
      console.log('📍 Setting location data:', { lng, lat, locationData });
    }

    console.log('Creating spot with location:', locationData);

    const { data, error } = await supabase
      .from('hangout_spots')
      .insert({
        name: spotData.name,
        description: spotData.description,
        location: locationData,
        address: spotData.address,
        spot_type: spotData.spot_type,
        capacity: spotData.capacity || 20,
        amenities: spotData.amenities || [],
        operating_hours: spotData.operating_hours,
        contact_info: spotData.contact_info,
        images: spotData.images || [],
        created_by: user.id,
        verification_status: 'pending'
      })
      .select(`
      *,
      user:profiles(*)
    `)
      .single();

    if (error) {
      console.error('Error creating hangout spot:', error);
      throw error;
    }

    return data;
  },

  // Check in to hangout spot
  async checkIn(spotId: string): Promise<HangoutCheckin> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if already checked in somewhere
    const { data: existingCheckin } = await supabase
      .from('hangout_checkins')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_current', true)
      .single();

    if (existingCheckin) {
      throw new Error('You are already checked in to another location');
    }

    // Check spot capacity
    const { data: spot } = await supabase
      .from('hangout_spots')
      .select('capacity, current_occupancy')
      .eq('id', spotId)
      .single();

    if (spot && spot.capacity && spot.current_occupancy >= spot.capacity) {
      throw new Error('This spot is at full capacity');
    }

    const { data, error } = await supabase
      .from('hangout_checkins')
      .insert({
        hangout_spot_id: spotId,
        user_id: user.id,
        is_current: true
      })
      .select()
      .single();

    if (error) throw error;

    // Get the hangout spot details separately
    const { data: hangoutSpot } = await supabase
      .from('hangout_spots')
      .select('*')
      .eq('id', spotId)
      .single();

    return {
      ...data,
      hangout_spot: hangoutSpot
    } as HangoutCheckin;
  },

  // Check out from hangout spot
  async checkOut(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('hangout_checkins')
      .update({
        is_current: false,
        checkout_time: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('is_current', true);

    if (error) throw error;
  },

  async getCurrentCheckin(): Promise<HangoutCheckin | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user found in getCurrentCheckin');
      return null;
    }

    try {
      console.log('Fetching checkin for user:', user.id);

      const { data: checkin, error } = await supabase
        .from('hangout_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_current', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching current checkin:', error);
        return null;
      }

      if (!checkin) {
        console.log('No current checkin found for user');
        return null;
      }

      console.log('Found checkin:', checkin.id);

      // Get the hangout spot details
      const { data: hangoutSpot, error: spotError } = await supabase
        .from('hangout_spots')
        .select('*')
        .eq('id', checkin.hangout_spot_id)
        .single();

      if (spotError) {
        console.error('Error fetching hangout spot:', spotError);
        return {
          ...checkin,
          hangout_spot: null
        } as HangoutCheckin;
      }

      return {
        ...checkin,
        hangout_spot: hangoutSpot
      } as HangoutCheckin;
    } catch (error) {
      console.error('Unexpected error in getCurrentCheckin:', error);
      return null;
    }
  },

  async updateHangoutSpot(spotId: string, spotData: {
    name: string;
    description: string;
    location: any;
    address: string;
    spot_type: string;
    capacity?: number;
    amenities?: string[];
    operating_hours?: any;
    contact_info?: any;
    images?: string[];
  }): Promise<HangoutSpot> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    let locationData = null;
    if (spotData.location && spotData.location.coordinates) {
      const [lng, lat] = spotData.location.coordinates;
      locationData = `POINT(${lng} ${lat})`;
      console.log('📍 Setting location data:', { lng, lat, locationData });
    }

    const { data, error } = await supabase
      .from('hangout_spots')
      .update({
        name: spotData.name,
        description: spotData.description,
        location: locationData,
        address: spotData.address,
        spot_type: spotData.spot_type,
        capacity: spotData.capacity || 20,
        amenities: spotData.amenities || [],
        operating_hours: spotData.operating_hours,
        contact_info: spotData.contact_info,
        images: spotData.images || [],
        updated_at: new Date().toISOString()
      })
      .eq('id', spotId)
      .select(`
      *,
      user:profiles(*)
    `)
      .single();

    if (error) {
      console.error('Error updating hangout spot:', error);
      throw new Error(error.message || 'Failed to update hangout spot');
    }

    return data;
  },

  async deleteHangoutSpot(spotId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('You must be logged in to delete a hangout spot');
    }

    console.log('🗑️ Performing HARD DELETE for hangout spot:', spotId, 'by user:', user.id);

    try {
      // First, verify ownership
      const { data: spot, error: checkError } = await supabase
        .from('hangout_spots')
        .select('id, created_by, name')
        .eq('id', spotId)
        .single();

      if (checkError) {
        console.error('❌ Error checking spot ownership:', checkError);
        throw new Error('Failed to verify spot ownership');
      }

      if (!spot) {
        throw new Error('Hangout spot not found');
      }

      console.log('📋 Spot details:', spot);

      if (spot.created_by !== user.id) {
        throw new Error('You can only delete your own hangout spots');
      }

      // Perform HARD DELETE - completely remove the record
      const { error: deleteError } = await supabase
        .from('hangout_spots')
        .delete()
        .eq('id', spotId);

      if (deleteError) {
        console.error('❌ Error performing hard delete:', deleteError);
        
        // Provide more specific error messages
        if (deleteError.code === '42501') {
          throw new Error('Permission denied. Please ensure you own this spot and try again.');
        } else if (deleteError.code === 'PGRST116') {
          throw new Error('Hangout spot not found or already deleted.');
        }
        
        throw new Error(deleteError.message || 'Failed to delete hangout spot');
      }

      console.log('✅ Hangout spot permanently deleted successfully');
    } catch (error: any) {
      console.error('❌ Error in deleteHangoutSpot:', error);
      throw error;
    }
  },

  async getMyHangoutSpots(): Promise<HangoutSpot[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('hangout_spots')
      .select(`
      *,
      user:profiles(*)
    `)
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user hangout spots:', error);
      throw error;
    }

    return data || [];
  },

  // Add review to hangout spot
  async addReview(spotId: string, reviewData: {
    rating: number;
    comment?: string;
    images?: string[];
  }): Promise<HangoutSpotReview> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('hangout_spot_reviews')
      .insert({
        hangout_spot_id: spotId,
        user_id: user.id,
        ...reviewData
      })
      .select(`
        *,
        user:profiles(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Get spot reviews
  async getSpotReviews(spotId: string): Promise<HangoutSpotReview[]> {
    const { data, error } = await supabase
      .from('hangout_spot_reviews')
      .select(`
        *,
        user:profiles(*)
      `)
      .eq('hangout_spot_id', spotId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Real-time subscription for hangout spots
  subscribeToHangoutSpots(callback: (payload: { event: 'INSERT' | 'UPDATE' | 'DELETE', data: HangoutSpot | { id: string } }) => void) {
    const subscription = supabase
      .channel('public:hangout_spots')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'hangout_spots',
        },
        async (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const { data } = await supabase
              .from('hangout_spots')
              .select(`
                *,
                user:profiles(*)
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
  },

  // Real-time subscription for checkins
  subscribeToCheckins(callback: (payload: { event: 'INSERT' | 'UPDATE' | 'DELETE', data: HangoutCheckin | { id: string } }) => void) {
    const subscription = supabase
      .channel('public:hangout_checkins')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'hangout_checkins',
        },
        async (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const { data: checkin } = await supabase
              .from('hangout_checkins')
              .select('*')
              .eq('id', payload.new.id)
              .single();

            if (checkin) {
              const { data: hangoutSpot } = await supabase
                .from('hangout_spots')
                .select('*')
                .eq('id', checkin.hangout_spot_id)
                .single();

              const fullCheckinData = {
                ...checkin,
                hangout_spot: hangoutSpot
              } as HangoutCheckin;

              callback({ event: payload.eventType, data: fullCheckinData });
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