// src/config/map.ts
import L from 'leaflet';

export const MAP_CONFIG = {
  // Enhanced tile layer providers
  tileLayers: {
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    cartoVoyager: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
    },
    cartoDark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }
  },

  // Default map settings
  defaultCenter: {
    lat: 20.5937, // Center of India
    lng: 78.9629
  },
  defaultZoom: 5,
  maxZoom: 19,
  minZoom: 2,

  // Remove bounds for worldwide coverage
  maxBounds: undefined,

  // Search provider configuration (worldwide)
  searchProvider: {
    provider: 'openstreetmap',
    params: {
      countrycodes: '', // Empty for worldwide
      limit: 10,
      addressdetails: 1
    }
  }
};

// Enhanced custom icon creation with better visuals
export const createCustomIcon = (type: 'event' | 'hangout' | 'user' | 'current') => {
  const colors = {
    event: 'bg-red-500 border-red-600',
    hangout: 'bg-purple-500 border-purple-600',
    user: 'bg-blue-500 border-blue-600',
    current: 'bg-green-500 border-green-600 shadow-lg'
  };

  const icons = {
    event: '🎯',
    hangout: '📍',
    user: '👤',
    current: '⭐'
  };

  return L.divIcon({
    className: `custom-marker custom-marker-${type} animate-bounce`,
    html: `
      <div class="relative">
        <div class="w-8 h-8 ${colors[type]} rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-sm transform hover:scale-110 transition-transform">
          ${icons[type]}
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 ${colors[type]} rounded-full"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -36]
  });
};