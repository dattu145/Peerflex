// src/components/map/HangoutSpotsMap.tsx
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import BaseMap from './BaseMap';
import { createCustomIcon } from '../../config/map';
import type { HangoutSpot, Location } from '../../types';
import { MapPin, Users, Star, Wifi, Coffee, Book } from 'lucide-react';
import Button from '../ui/Button';

interface HangoutSpotsMapProps {
  spots: HangoutSpot[];
  currentLocation?: Location | null;
  onSpotClick?: (spot: HangoutSpot) => void;
  onCheckIn?: (spotId: string) => void;
  className?: string;
  singleSpotMode?: boolean;
}

export const HangoutSpotsMap: React.FC<HangoutSpotsMapProps> = ({
  spots,
  currentLocation,
  onSpotClick,
  onCheckIn,
  className = '',
  singleSpotMode = false
}) => {
  const getMapCenter = (): [number, number] => {
    if (spots.length === 0) {
      return currentLocation 
        ? [currentLocation.latitude, currentLocation.longitude]
        : [20.5937, 78.9629]; // India center
    }

    const firstSpot = spots[0];
    const coordinates = getSpotCoordinates(firstSpot);
    return coordinates;
  };

  const getSpotCoordinates = (spot: HangoutSpot): [number, number] => {
    if (spot.location) {
      try {
        let coords: [number, number] = [78.9629, 20.5937]; // Default to India center
        
        if (typeof spot.location === 'string') {
          // Parse PostGIS POINT string: "POINT(lng lat)" or "SRID=4326;POINT(lng lat)"
          const match = spot.location.match(/POINT\(([^ ]+) ([^ ]+)\)/);
          if (match) {
            coords = [parseFloat(match[1]), parseFloat(match[2])];
          }
        } else if (spot.location.coordinates && Array.isArray(spot.location.coordinates)) {
          // Handle object format: { coordinates: [lng, lat] }
          coords = spot.location.coordinates;
        }
        
        console.log('📍 Spot coordinates:', {
          spotId: spot.id,
          spotName: spot.name,
          rawLocation: spot.location,
          parsedCoords: coords,
          leafletCoords: [coords[1], coords[0]] // Convert to [lat, lng] for Leaflet
        });
        
        // Return as [lat, lng] for Leaflet
        return [coords[1], coords[0]];
      } catch (error) {
        console.warn('❌ Error parsing spot coordinates:', error, spot);
        return [20.5937, 78.9629];
      }
    }
    
    console.warn('❌ No location data for spot:', spot.id, spot.name);
    return [20.5937, 78.9629];
  };

  const getSpotIcon = (spotType: string) => {
    const icons: Record<string, string> = {
      cafe: '☕',
      library: '📚',
      park: '🌳',
      study_room: '📖',
      food: '🍽️',
      social: '🎯',
      sports: '⚽',
      other: '📍'
    };
    return icons[spotType] || '📍';
  };

  const getCapacityColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className={className}>
      <BaseMap 
        center={getMapCenter()} 
        zoom={singleSpotMode ? 15 : 12}
        className="h-96 md:h-[500px]"
      >
        {/* Current Location Marker */}
        {currentLocation && (
          <Marker
            position={[currentLocation.latitude, currentLocation.longitude]}
            icon={createCustomIcon('current')}
          >
            <Popup>
              <div className="text-center">
                <p className="font-semibold">Your Location</p>
                <p className="text-sm text-gray-600">You are here</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Hangout Spot Markers */}
        {spots.map((spot) => {
          const coordinates = getSpotCoordinates(spot);
          
          console.log('🎯 Rendering marker for spot:', {
            spotId: spot.id,
            spotName: spot.name,
            coordinates: coordinates
          });
          
          return (
            <Marker
              key={spot.id}
              position={coordinates}
              icon={createCustomIcon('hangout')}
              eventHandlers={{
                click: () => onSpotClick?.(spot)
              }}
            >
              <Popup>
                <div className="min-w-64">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {spot.name}
                    </h3>
                    <span className="text-lg">{getSpotIcon(spot.spot_type)}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {spot.description}
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Users className="h-3 w-3" />
                        <span>Occupancy</span>
                      </div>
                      <span className={getCapacityColor(spot.current_occupancy, spot.capacity)}>
                        {spot.current_occupancy} / {spot.capacity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Star className="h-3 w-3" />
                        <span>Rating</span>
                      </div>
                      <span className="text-yellow-600 dark:text-yellow-400">
                        {spot.rating.toFixed(1)} ⭐
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <MapPin className="h-3 w-3" />
                      <span className="flex-1">{spot.address}</span>
                    </div>

                    {/* Amenities */}
                    {spot.amenities && spot.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {spot.amenities.slice(0, 3).map((amenity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 dark:blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                          >
                            {amenity}
                          </span>
                        ))}
                        {spot.amenities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                            +{spot.amenities.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSpotClick?.(spot)}
                      className="flex-1"
                    >
                      Details
                    </Button>
                    {onCheckIn && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onCheckIn(spot.id)}
                        disabled={spot.current_occupancy >= spot.capacity}
                      >
                        Check In
                      </Button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </BaseMap>

      {/* Map Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Your Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span>Hangout Spots</span>
        </div>
      </div>
    </div>
  );
};

export default HangoutSpotsMap;