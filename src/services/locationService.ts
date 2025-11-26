// src/services/locationService.ts
import type { Location } from '../types';

export interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address?: {
    house_number?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

// CORS proxy URLs - we'll try multiple in case one fails
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/'
];

class LocationService {
  private currentProxyIndex = 0;

  // Enhanced current location with better accuracy
  async getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0 // Don't use cached position
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location permissions.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }

          reject(new Error(errorMessage));
        },
        options
      );
    });
  }

  private async fetchWithTimeout(url: string, timeout = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Get approximate location from IP as fallback
  async getApproximateLocation(): Promise<Location> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      return {
        latitude: data.latitude,
        longitude: data.longitude
      };
    } catch (error) {
      // Fallback to default location
      return {
        latitude: 12.9716,
        longitude: 77.5946
      };
    }
  }

  // Enhanced search with proxy fallback
  async searchLocations(query: string, limit: number = 8): Promise<SearchResult[]> {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    const targetUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=${limit}&addressdetails=1`;

    // In development, skip direct API calls to avoid CORS errors in console
    const attempts = import.meta.env.DEV 
      ? CORS_PROXIES.map(proxy => ({ url: proxy + encodeURIComponent(targetUrl), type: 'proxy' }))
      : [
          { url: targetUrl, type: 'direct' },
          ...CORS_PROXIES.map(proxy => ({ url: proxy + encodeURIComponent(targetUrl), type: 'proxy' }))
        ];

    for (let i = 0; i < attempts.length; i++) {
      try {
        console.log(`🔍 Search attempt ${i + 1}: ${attempts[i].type}`);

        const response = await this.fetchWithTimeout(attempts[i].url, 10000);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const text = await response.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.warn('Failed to parse response as JSON:', text.substring(0, 200));
          throw new Error('Invalid JSON response');
        }

        if (!Array.isArray(data)) {
          console.warn('Response is not an array:', data);
          return [];
        }

        console.log(`✅ Search successful via ${attempts[i].type}, found ${data.length} results`);
        return data.map((item: any) => ({
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
          type: item.type || item.class || 'location',
          address: item.address
        }));
      } catch (error) {
        console.warn(`❌ Search attempt ${i + 1} failed:`, error);
        if (i < attempts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }

    console.warn('🚨 All search attempts failed');
    return [];
  }

  // Enhanced reverse geocoding with proxy fallback
  async getAddressFromCoords(location: Location): Promise<string> {
    const targetUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&zoom=18&addressdetails=1`;

    // In development, skip direct API calls to avoid CORS errors in console
    const attempts = import.meta.env.DEV 
      ? CORS_PROXIES.map(proxy => ({ url: proxy + encodeURIComponent(targetUrl), type: 'proxy' }))
      : [
          { url: targetUrl, type: 'direct' },
          ...CORS_PROXIES.map(proxy => ({ url: proxy + encodeURIComponent(targetUrl), type: 'proxy' }))
        ];

    for (let i = 0; i < attempts.length; i++) {
      try {
        console.log(`📍 Reverse geocode attempt ${i + 1}: ${attempts[i].type}`);

        const response = await this.fetchWithTimeout(attempts[i].url, 10000);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const text = await response.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.warn('Failed to parse reverse geocode response:', text.substring(0, 200));
          throw new Error('Invalid JSON response');
        }

        if (data.error) {
          throw new Error(data.error);
        }

        const address = data.display_name || this.getFallbackAddress(location);
        console.log(`✅ Reverse geocode successful via ${attempts[i].type}`);
        return address;
      } catch (error) {
        console.warn(`❌ Reverse geocode attempt ${i + 1} failed:`, error);
        if (i < attempts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }

    console.warn('🚨 All reverse geocode attempts failed, using fallback');
    return this.getFallbackAddress(location);
  }

  // Enhanced forward geocoding
  async getCoordsFromAddress(address: string): Promise<Location> {
    if (!address.trim()) {
      throw new Error('Please enter an address');
    }

    try {
      const results = await this.searchLocations(address, 1);

      if (results.length > 0) {
        return {
          latitude: parseFloat(results[0].lat),
          longitude: parseFloat(results[0].lon)
        };
      }

      throw new Error('Address not found');
    } catch (error) {
      console.warn('Forward geocoding failed:', error);
      throw error;
    }
  }

  // Calculate distance between two points in kilometers
  calculateDistance(point1: Location, point2: Location): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(point2.latitude - point1.latitude);
    const dLon = this.deg2rad(point2.longitude - point1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(point1.latitude)) * Math.cos(this.deg2rad(point2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Convert degrees to radians
  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Format distance for display
  formatDistance(distanceInKm: number): string {
    if (distanceInKm < 1) {
      return `${Math.round(distanceInKm * 1000)}m`;
    }
    return `${distanceInKm.toFixed(1)}km`;
  }

  // Fallback address generator
  getFallbackAddress(location: Location): string {
    return `Location at ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  }

  // Check if coordinates are valid
  isValidCoordinates(latitude: number, longitude: number): boolean {
    return (
      latitude >= -90 && latitude <= 90 &&
      longitude >= -180 && longitude <= 180
    );
  }
}

export const locationService = new LocationService();