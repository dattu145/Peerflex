// src/hooks/useLocation.ts
import { useState, useEffect, useCallback } from 'react';
import { locationService } from '../services/locationService';
import type { Location } from '../types';

interface UseLocationProps {
  autoRequest?: boolean;
  enableHighAccuracy?: boolean;
}

export const useLocation = (props?: UseLocationProps) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<PermissionState | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  // Check permission status
  const checkPermission = useCallback(async () => {
    if (!navigator.permissions) {
      setPermission('prompt');
      return;
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      setPermission(result.state);
      
      result.onchange = () => {
        setPermission(result.state);
      };
    } catch {
      setPermission('prompt');
    }
  }, []);

  // Enhanced location request with fallbacks
  const requestLocation = useCallback(async (highAccuracy = false): Promise<Location> => {
    setLoading(true);
    setError(null);
    
    try {
      // Try precise GPS location first
      const currentLocation = await locationService.getCurrentLocation();
      setLocation(currentLocation);
      setAccuracy(currentLocation.accuracy || null);
      setPermission('granted');
      return currentLocation;
    } catch (gpsError) {
      console.warn('GPS location failed, trying IP-based location:', gpsError);
      
      try {
        // Fallback to IP-based approximate location
        const approximateLocation = await locationService.getApproximateLocation();
        setLocation(approximateLocation);
        setAccuracy(approximateLocation.accuracy || null);
        setError('Using approximate location. Enable GPS for better accuracy.');
        return approximateLocation;
      } catch (ipError) {
        console.error('All location methods failed:', ipError);
        setError('Unable to determine your location. Please enable location services or enter manually.');
        throw new Error('Location services unavailable');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-request location on mount if enabled
  useEffect(() => {
    checkPermission();
    
    if (props?.autoRequest) {
      // Only auto-request if permission is granted or prompt
      if (permission === 'granted' || permission === 'prompt') {
        requestLocation(props?.enableHighAccuracy).catch(() => {
          // Silent fail for auto-request
        });
      }
    }
  }, [props?.autoRequest, props?.enableHighAccuracy, permission, checkPermission, requestLocation]);

  const getAddress = useCallback(async (loc?: Location): Promise<string> => {
    const targetLocation = loc || location;
    if (!targetLocation) {
      throw new Error('No location available');
    }
    
    return await locationService.getAddressFromCoords(targetLocation);
  }, [location]);

  const getCoordsFromAddress = useCallback(async (address: string): Promise<Location> => {
    return await locationService.getCoordsFromAddress(address);
  }, []);

  const searchLocations = useCallback(async (query: string, limit?: number) => {
    return await locationService.searchLocations(query, limit);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setAccuracy(null);
  }, []);

  return {
    location,
    loading,
    error,
    permission,
    accuracy,
    requestLocation,
    getAddress,
    getCoordsFromAddress,
    searchLocations,
    checkPermission,
    clearError,
    clearLocation
  };
};