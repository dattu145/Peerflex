// src/components/map/EventsMap.tsx
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import BaseMap from './BaseMap';
import { createCustomIcon } from '../../config/map';
import type { Event, Location } from '../../types';
import { Calendar, Users, MapPin, Clock } from 'lucide-react';
import Button from '../ui/Button';

interface EventsMapProps {
  events: Event[];
  currentLocation?: Location | null;
  onEventClick?: (event: Event) => void;
  className?: string;
}

export const EventsMap: React.FC<EventsMapProps> = ({
  events,
  currentLocation,
  onEventClick,
  className = ''
}) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate map center
  const getMapCenter = (): [number, number] => {
    if (events.length === 0) {
      return currentLocation 
        ? [currentLocation.latitude, currentLocation.longitude]
        : [12.9716, 77.5946]; // Default to Bangalore
    }

    // Center on first event or average of all events
    const firstEvent = events[0];
    if (firstEvent.location) {
      // For PostGIS geography type, we need to extract coordinates
      // This assumes location is stored as { type: 'Point', coordinates: [lng, lat] }
      try {
        const coords = firstEvent.location.coordinates || [77.5946, 12.9716];
        return [coords[1], coords[0]]; // GeoJSON is [lng, lat], Leaflet wants [lat, lng]
      } catch {
        return [12.9716, 77.5946];
      }
    }

    return [12.9716, 77.5946];
  };

  const getEventCoordinates = (event: Event): [number, number] => {
    if (event.location) {
      try {
        const coords = event.location.coordinates || [77.5946, 12.9716];
        return [coords[1], coords[0]];
      } catch {
        return [12.9716, 77.5946];
      }
    }
    return [12.9716, 77.5946];
  };

  return (
    <div className={className}>
      <BaseMap center={getMapCenter()} className="h-96 md:h-[500px]">
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

        {/* Event Markers */}
        {events.map((event) => {
          const coordinates = getEventCoordinates(event);
          
          return (
            <Marker
              key={event.id}
              position={coordinates}
              icon={createCustomIcon('event')}
              eventHandlers={{
                click: () => onEventClick?.(event)
              }}
            >
              <Popup>
                <div className="min-w-64">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {event.description}
                  </p>

                  <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDateTime(event.start_time)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>{event.venue_name || event.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      <span>
                        {event.attendees_count || 0} / {event.max_attendees} attendees
                      </span>
                    </div>

                    {event.is_virtual && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>Virtual Event</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onEventClick?.(event)}
                      className="flex-1"
                    >
                      View Details
                    </Button>
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
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Your Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Events</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Hangout Spots</span>
        </div>
      </div>
    </div>
  );
};

export default EventsMap;