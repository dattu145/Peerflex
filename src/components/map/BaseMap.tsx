// src/components/map/BaseMap.tsx
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import { MAP_CONFIG } from '../../config/map';
import 'leaflet/dist/leaflet.css';
import '../../styles/map.css';
import * as L from 'leaflet';

interface BaseMapProps {
    center?: [number, number];
    zoom?: number;
    children?: React.ReactNode;
    className?: string;
    onMapClick?: (latlng: { lat: number; lng: number }) => void;
    onViewportChange?: (viewport: { center: [number, number]; zoom: number }) => void;
}

// Map event handler component
const MapEvents: React.FC<{
    onMapClick?: (latlng: { lat: number; lng: number }) => void;
    onViewportChange?: (viewport: { center: [number, number]; zoom: number }) => void;
}> = ({ onMapClick, onViewportChange }) => {
    const map = useMap();

    useMapEvents({
        click: (e) => {
            onMapClick?.(e.latlng);
        },
        moveend: () => {
            onViewportChange?.({
                center: [map.getCenter().lat, map.getCenter().lng],
                zoom: map.getZoom()
            });
        },
        zoomend: () => {
            onViewportChange?.({
                center: [map.getCenter().lat, map.getCenter().lng],
                zoom: map.getZoom()
            });
        }
    });

    return null;
};

// Map controller for external center/zoom changes
const MapController: React.FC<{
    center: [number, number];
    zoom: number;
}> = ({ center, zoom }) => {
    const map = useMap();

    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);

    return null;
};

// Fix Leaflet default icon issue
const fixLeafletIcons = () => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
};

export const BaseMap = forwardRef<any, BaseMapProps>(({
    center = [MAP_CONFIG.defaultCenter.lat, MAP_CONFIG.defaultCenter.lng],
    zoom = MAP_CONFIG.defaultZoom,
    children,
    className = '',
    onMapClick,
    onViewportChange
}, ref) => {
    const [map, setMap] = useState<any>(null);

    useImperativeHandle(ref, () => ({
        getMap: () => map,
        setView: (lat: number, lng: number, zoomLevel?: number) => {
            if (map) {
                map.setView([lat, lng], zoomLevel || zoom);
            }
        }
    }));

    // Fix Leaflet default icon issue
    useEffect(() => {
        fixLeafletIcons();
    }, []);

    return (
        <div className={`map-container ${className}`}>
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                ref={setMap}
                scrollWheelZoom={true}
                zoomControl={true}
                maxBounds={MAP_CONFIG.maxBounds as any}
                maxZoom={MAP_CONFIG.maxZoom}
                minZoom={MAP_CONFIG.minZoom}
            >
                <TileLayer
                    attribution={MAP_CONFIG.tileLayers.osm.attribution}
                    url={MAP_CONFIG.tileLayers.osm.url}
                />

                <MapController center={center} zoom={zoom} />
                <MapEvents onMapClick={onMapClick} onViewportChange={onViewportChange} />

                {children}
            </MapContainer>
        </div>
    );
});

BaseMap.displayName = 'BaseMap';

export default BaseMap;