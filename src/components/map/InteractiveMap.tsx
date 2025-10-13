import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

interface MapMarker {
  id: number;
  title?: string;
  name?: string;
  location: {
    lat: number;
    lng: number;
  };
  type?: string;
  date?: string;
  status?: string;
  major?: string;
  participants?: number;
}

interface InteractiveMapProps {
  data: MapMarker[];
  type: 'events' | 'users' | 'hangouts';
  className?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ data, type, className }) => {
  const defaultCenter: [number, number] = [40.7128, -74.0060];

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'events': return '#8b5cf6';
      case 'users': return '#3b82f6';
      case 'hangouts': return '#10b981';
      default: return '#6b7280';
    }
  };

  const CustomMarker = ({ marker }: { marker: MapMarker }) => (
    <Marker position={[marker.location.lat, marker.location.lng]}>
      <Popup>
        <div className="p-2">
          <h3 className="font-semibold text-gray-900">
            {marker.title || marker.name}
          </h3>
          {marker.date && (
            <p className="text-sm text-gray-600">Date: {marker.date}</p>
          )}
          {marker.major && (
            <p className="text-sm text-gray-600">Major: {marker.major}</p>
          )}
          {marker.participants && (
            <p className="text-sm text-gray-600">Participants: {marker.participants}</p>
          )}
        </div>
      </Popup>
    </Marker>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      <MapContainer
        center={defaultCenter}
        zoom={12}
        style={{ height: '100%', width: '100%', zIndex:'-2' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data.map((marker) => (
          <CustomMarker key={marker.id} marker={marker} />
        ))}
      </MapContainer>
    </motion.div>
  );
};

export default InteractiveMap;