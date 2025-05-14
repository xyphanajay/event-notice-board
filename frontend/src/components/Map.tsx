import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from '@mui/material';

// This would normally come from environment variables
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN';

interface MapProps {
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  markers?: Array<{
    id: string;
    lngLat: [number, number];
    title?: string;
    description?: string;
  }>;
  onClick?: (lngLat: { lng: number; lat: number }) => void;
  height?: string | number;
  width?: string | number;
}

const Map: React.FC<MapProps> = ({
  center = [-122.4194, 37.7749], // Default to San Francisco
  zoom = 10,
  markers = [],
  onClick,
  height = 400,
  width = '100%',
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center,
      zoom,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Add click handler
    if (onClick) {
      map.current.on('click', (e) => {
        onClick(e.lngLat);
      });
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Update center and zoom when props change
  useEffect(() => {
    if (!map.current) return;

    map.current.setCenter(center);
    map.current.setZoom(zoom);
  }, [center, zoom]);

  // Update markers when they change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove any existing markers
    document.querySelectorAll('.mapboxgl-marker').forEach((el) => el.remove());

    // Add new markers
    markers.forEach((marker) => {
      const markerElement = document.createElement('div');
      markerElement.className = 'map-marker';
      markerElement.style.backgroundImage = 'url(https://docs.mapbox.com/mapbox-gl-js/assets/pin.png)';
      markerElement.style.width = '32px';
      markerElement.style.height = '32px';
      markerElement.style.backgroundSize = 'contain';
      markerElement.style.backgroundRepeat = 'no-repeat';

      // Create popup for marker
      let popup;
      if (marker.title || marker.description) {
        popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h3>${marker.title || ''}</h3><p>${marker.description || ''}</p>`
        );
      }

      new mapboxgl.Marker(markerElement)
        .setLngLat(marker.lngLat)
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [markers, mapLoaded]);

  return (
    <Box
      ref={mapContainer}
      sx={{
        height,
        width,
        borderRadius: 1,
        overflow: 'hidden',
      }}
    />
  );
};

export default Map;