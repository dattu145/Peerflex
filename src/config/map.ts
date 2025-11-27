// src/config/map.ts
import L from 'leaflet';

// Fix Leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const MAP_CONFIG = {
  tileLayers: {
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  },

  // Better default center (India)
  defaultCenter: {
    lat: 20.5937,
    lng: 78.9629
  },
  defaultZoom: 5,
  maxZoom: 19,
  minZoom: 2,

  // Worldwide bounds
  maxBounds: [
    [-90, -180], // Southwest
    [90, 180]    // Northeast
  ] as L.LatLngBoundsLiteral
};

// Enhanced custom icon creation
export const createCustomIcon = (type: 'event' | 'hangout' | 'user' | 'current') => {
  const colors = {
    event: '#ef4444',
    hangout: '#8b5cf6', 
    user: '#3b82f6',
    current: '#10b981'
  };

  const icons = {
    event: '🎯',
    hangout: '📍',
    user: '👤',
    current: '⭐'
  };

  return L.divIcon({
    className: `custom-marker-${type}`,
    html: `
      <div style="
        background-color: ${colors[type]};
        border: 3px solid white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transform: translate(-50%, -50%);
      ">
        ${icons[type]}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};