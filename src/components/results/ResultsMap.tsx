'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ResultsMapProps {
  guessLat: number | null;
  guessLng: number | null;
  actualLat: number;
  actualLng: number;
  distanceKm: number;
}

export default function ResultsMap({ guessLat, guessLng, actualLat, actualLng, distanceKm }: ResultsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const map = L.map(container, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      touchZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const guessIcon = L.divIcon({
      className: 'pin-marker',
      html: `<svg class="map-pin-guess" width="28" height="28" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="8"/></svg>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const actualIcon = L.divIcon({
      className: 'pin-marker',
      html: `<svg class="map-pin-actual" width="28" height="28" viewBox="0 0 24 24" fill="#22c55e" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="8"/></svg>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const points: [number, number][] = [];

    if (guessLat !== null && guessLng !== null) {
      L.marker([guessLat, guessLng], { icon: guessIcon }).addTo(map);
      points.push([guessLat, guessLng]);
    }

    L.marker([actualLat, actualLng], { icon: actualIcon }).addTo(map);
    points.push([actualLat, actualLng]);

    if (points.length === 2) {
      L.polyline(points, { color: '#facc15', weight: 2, dashArray: '6 4', className: 'map-connecting-line' }).addTo(map);

      const midLat = (points[0][0] + points[1][0]) / 2;
      const midLng = (points[0][1] + points[1][1]) / 2;
      const label = L.divIcon({
        className: 'distance-label map-distance-label',
        html: `<div class="map-distance-label" style="background:#1f2937;color:#facc15;padding:2px 8px;border-radius:8px;font-size:12px;font-family:monospace;white-space:nowrap;border:1px solid #374151">${distanceKm.toLocaleString()} km</div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });
      L.marker([midLat, midLng], { icon: label, interactive: false }).addTo(map);
    }

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });

    mapRef.current = map;

    const ro = new ResizeObserver(() => { map.invalidateSize(); });
    ro.observe(container);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes mapPinFadeIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes mapLineFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .map-pin-guess {
          animation: mapPinFadeIn 0.4s ease-out 0s forwards;
          opacity: 0;
        }
        .map-pin-actual {
          animation: mapPinFadeIn 0.4s ease-out 0.2s forwards;
          opacity: 0;
        }
        .map-connecting-line {
          animation: mapLineFadeIn 0.6s ease-out 0.4s forwards;
          opacity: 0;
        }
        .map-distance-label {
          animation: mapLineFadeIn 0.6s ease-out 0.4s forwards;
          opacity: 0;
        }
      `}</style>
      <div ref={containerRef} className="w-full h-48 rounded-lg overflow-hidden" />
    </>
  );
}
