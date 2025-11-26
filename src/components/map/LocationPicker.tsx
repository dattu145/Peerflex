// src/components/map/LocationPicker.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Marker, Popup } from 'react-leaflet';
import BaseMap from './BaseMap';
import { createCustomIcon } from '../../config/map';
import { locationService, type SearchResult } from '../../services/locationService';
import type { Location } from '../../types';
import { MapPin, Navigation, Search, Crosshair, AlertCircle, CheckCircle2 } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { debounce } from '../../utils/helpers';

interface LocationPickerProps {
  initialLocation?: Location;
  onLocationSelect: (location: Location, address?: string) => void;
  onError?: (error: string) => void;
  className?: string;
  showSearch?: boolean;
  enableCurrentLocation?: boolean;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  initialLocation,
  onLocationSelect,
  onError,
  className = '',
  showSearch = true,
  enableCurrentLocation = true
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    initialLocation || null
  );
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [address, setAddress] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isGettingAddress, setIsGettingAddress] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    initialLocation ? [initialLocation.latitude, initialLocation.longitude] : [12.9716, 77.5946]
  );

  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const mapRef = useRef<{ getMap: () => any; setView: (lat: number, lng: number, zoom?: number) => void }>(null);

  // Enhanced current location with better UX
  const getCurrentLocation = async () => {
    if (!enableCurrentLocation) return;

    setIsGettingLocation(true);
    setSearchQuery('');
    setSearchResults([]);

    try {
      const location = await locationService.getCurrentLocation();
      
      setCurrentLocation(location);
      setSelectedLocation(location);
      setMapCenter([location.latitude, location.longitude]);

      // Get address for current location with better error handling
      setIsGettingAddress(true);
      try {
        const currentAddress = await locationService.getAddressFromCoords(location);
        setAddress(currentAddress);
        setSearchQuery(currentAddress);
        onLocationSelect(location, currentAddress);
      } catch (addressError) {
        console.warn('Failed to get address, using coordinates:', addressError);
        const fallbackAddress = locationService.getFallbackAddress(location);
        setAddress(fallbackAddress);
        setSearchQuery(fallbackAddress);
        onLocationSelect(location, fallbackAddress);
      }
    } catch (error) {
      console.error('Failed to get current location:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';

      // Provide helpful guidance
      if (errorMessage.includes('permission')) {
        onError?.('Location access denied. Please enable location permissions in your browser settings and refresh the page.');
      } else if (errorMessage.includes('timeout')) {
        onError?.('Location request timed out. Please check your internet connection and try again.');
      } else if (errorMessage.includes('unavailable')) {
        onError?.('Location information unavailable. Please try again or enter location manually.');
      } else {
        onError?.(errorMessage);
      }
    } finally {
      setIsGettingLocation(false);
      setIsGettingAddress(false);
    }
  };

  // Enhanced search with better error handling
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim() || query.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await locationService.searchLocations(query);
        setSearchResults(results);
        
        if (results.length === 0 && query.length >= 2) {
          onError?.('No locations found. Try a different search term or check your connection.');
        }
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
        onError?.('Search service temporarily unavailable. Please try again in a moment.');
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [onError]
  );

  // Handle map click with immediate feedback
  const handleMapClick = async (latlng: { lat: number; lng: number }) => {
    const location = { latitude: latlng.lat, longitude: latlng.lng };
    setSelectedLocation(location);
    setMapCenter([latlng.lat, latlng.lng]);

    // Show loading for address
    setIsGettingAddress(true);
    try {
      const locationAddress = await locationService.getAddressFromCoords(location);
      setAddress(locationAddress);
      setSearchQuery(locationAddress);
      onLocationSelect(location, locationAddress);
    } catch (error) {
      console.warn('Failed to get address:', error);
      const fallbackAddress = locationService.getFallbackAddress(location);
      setAddress(fallbackAddress);
      setSearchQuery(fallbackAddress);
      onLocationSelect(location, fallbackAddress);
    } finally {
      setIsGettingAddress(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Handle search result selection
  const handleSearchResultSelect = async (result: SearchResult) => {
    const location = {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon)
    };

    setSelectedLocation(location);
    setSearchQuery(result.display_name);
    setSearchResults([]);
    setAddress(result.display_name);
    setMapCenter([location.latitude, location.longitude]);
    onLocationSelect(location, result.display_name);
  };

  // Clear search and results
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  // Manual location selection via Enter key
  const handleManualLocationSelect = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const coords = await locationService.getCoordsFromAddress(searchQuery);
      setSelectedLocation(coords);
      setMapCenter([coords.latitude, coords.longitude]);
      
      try {
        const locationAddress = await locationService.getAddressFromCoords(coords);
        setAddress(locationAddress);
        onLocationSelect(coords, locationAddress);
      } catch (addressError) {
        console.warn('Failed to get address:', addressError);
        const fallbackAddress = locationService.getFallbackAddress(coords);
        setAddress(fallbackAddress);
        onLocationSelect(coords, fallbackAddress);
      }
    } catch (error) {
      console.error('Manual location selection failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to find location';
      onError?.(errorMessage);
    } finally {
      setIsSearching(false);
    }
  };

  // Initial location setup - only run if we don't already have a location
  useEffect(() => {
    if (initialLocation && !selectedLocation) {
      setSelectedLocation(initialLocation);
      setMapCenter([initialLocation.latitude, initialLocation.longitude]);
      
      // Only fetch address if we don't already have one
      if (!address) {
        locationService.getAddressFromCoords(initialLocation)
          .then(address => {
            setAddress(address);
            setSearchQuery(address);
          })
          .catch(error => {
            console.warn('Failed to get initial address:', error);
            const fallbackAddress = locationService.getFallbackAddress(initialLocation);
            setAddress(fallbackAddress);
            setSearchQuery(fallbackAddress);
          });
      }
    }
  }, [initialLocation, selectedLocation, address]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Section */}
      {showSearch && (
        <div className="space-y-3">
          {/* Search Bar with Enhanced UX */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search for any location, address, or place..."
                leftIcon={<Search className="h-4 w-4" />}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleManualLocationSelect();
                  }
                }}
                className="pr-10"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
            
            {enableCurrentLocation && (
              <Button
                onClick={getCurrentLocation}
                variant="outline"
                className="whitespace-nowrap px-3"
                disabled={isGettingLocation}
                title="Use your current location"
              >
                {isGettingLocation ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                ) : (
                  <Crosshair className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={`${result.lat}-${result.lon}-${index}`}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors"
                  onClick={() => handleSearchResultSelect(result)}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {result.display_name}
                      </div>
                      {result.address && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {[
                            result.address.road,
                            result.address.neighbourhood,
                            result.address.suburb,
                            result.address.city
                          ].filter(Boolean).join(' • ')}
                        </div>
                      )}
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 capitalize">
                        {result.type}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Search States */}
          {isSearching && (
            <div className="text-center py-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-xs text-gray-500 mt-2">Searching locations worldwide...</p>
            </div>
          )}

          {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
            <div className="text-center py-3">
              <AlertCircle className="h-5 w-5 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500">No locations found. Try a different search term.</p>
            </div>
          )}
        </div>
      )}

      {/* Map Section */}
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <BaseMap
          center={mapCenter}
          zoom={selectedLocation ? 15 : 12}
          onMapClick={handleMapClick}
          className="h-64 md:h-80"
          ref={mapRef}
        >
          {/* Current Location Marker */}
          {currentLocation && (
            <Marker
              position={[currentLocation.latitude, currentLocation.longitude]}
              icon={createCustomIcon('current')}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-semibold">Your Current Location</p>
                  <p className="text-sm text-gray-600">GPS position</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Selected Location Marker */}
          {selectedLocation && (
            <Marker
              position={[selectedLocation.latitude, selectedLocation.longitude]}
              icon={createCustomIcon('hangout')}
            >
              <Popup>
                <div className="text-center min-w-48">
                  <p className="font-semibold">Selected Location</p>
                  {address && (
                    <p className="text-sm text-gray-600 mt-1 break-words">{address}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}
        </BaseMap>
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-300 mb-2">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-medium">Location Selected</span>
          </div>
          <div className="space-y-2">
            {address && (
              <p className="text-sm text-green-700 dark:text-green-400 break-words">{address}</p>
            )}
            <div className="flex justify-between items-center text-xs text-green-600 dark:text-green-500">
              <span>
                Coordinates: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
              </span>
              {isGettingAddress && (
                <span className="flex items-center gap-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                  Getting address...
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 mb-1">
          <Navigation className="h-4 w-4" />
          <span className="text-sm font-medium">How to select a location</span>
        </div>
        <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
          <li>• Search for any address, place, or landmark</li>
          <li>• Click directly on the map to select a location</li>
          <li>• Use the crosshair button for your current location</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationPicker;