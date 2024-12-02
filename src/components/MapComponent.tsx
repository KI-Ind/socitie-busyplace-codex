'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapComponentProps {
  address: {
    numeroVoieEtablissement: string;
    typeVoieEtablissement: string;
    libelleVoieEtablissement: string;
    codePostalEtablissement: string;
    libelleCommuneEtablissement: string;
  };
}

const MapComponent = ({ address }: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const fullAddress = `${address.numeroVoieEtablissement} ${address.typeVoieEtablissement} ${address.libelleVoieEtablissement}, ${address.codePostalEtablissement} ${address.libelleCommuneEtablissement}, France`;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 14,
      center: [2.3522, 48.8566] // Default to Paris
    });

    const geocodeAndPlaceMarker = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAddress)}.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const coordinates = data.features[0].geometry.coordinates;

          if (marker.current) {
            marker.current.remove();
          }

          marker.current = new mapboxgl.Marker()
            .setLngLat(coordinates)
            .addTo(map.current!);

          map.current!.flyTo({
            center: coordinates,
            zoom: 15,
            essential: true
          });
        }
      } catch (error) {
        console.error('Error geocoding address:', error);
      }
    };

    map.current.on('load', () => {
      geocodeAndPlaceMarker();
    });

    return () => {
      if (marker.current) {
        marker.current.remove();
      }
      if (map.current) {
        map.current.remove();
      }
    };
  }, [address]);

  return <div ref={mapContainer} className="w-full h-full" />;
};

export default MapComponent;
