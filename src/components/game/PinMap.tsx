'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface PinMapProps {
  onPinPlaced: (lat: number, lng: number) => void;
  disabled?: boolean;
  initialLat?: number;
  initialLng?: number;
  zoom?: number;
}

const TILE_TIMEOUT_MS = 10000;
const AUTO_RETRY_DELAY_MS = 3000;

export default function PinMap({ onPinPlaced, disabled, initialLat, initialLng, zoom = 2 }: PinMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onPinPlacedRef = useRef(onPinPlaced);
  const disabledRef = useRef(disabled);
  onPinPlacedRef.current = onPinPlaced;
  disabledRef.current = disabled;

  const [initializing, setInitializing] = useState(true);
  const [tileLoadFailed, setTileLoadFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [autoRetrying, setAutoRetrying] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setInitializing(true);
    setTileLoadFailed(false);
    setAutoRetrying(false);

    const map = L.map(container, {
      center: [20, 0],
      zoom,
      zoomControl: true,
      attributionControl: true,
    });

    const tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom',
    }).addTo(map);

    let tileLoaded = false;
    let tileTimeout: ReturnType<typeof setTimeout> | null = null;
    let autoRetryTimer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    const onTileLoad = () => {
      tileLoaded = true;
      if (tileTimeout) {
        clearTimeout(tileTimeout);
        tileTimeout = null;
      }
    };

    tileLayer.on('load', onTileLoad);
    tileLayer.on('tileload', onTileLoad);

    tileTimeout = setTimeout(() => {
      if (!tileLoaded && !disposed) {
        setAutoRetrying(true);
        autoRetryTimer = setTimeout(() => {
          if (!tileLoaded && !disposed) {
            setTileLoadFailed(true);
            setAutoRetrying(false);
          }
        }, AUTO_RETRY_DELAY_MS);
      }
    }, TILE_TIMEOUT_MS);

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (disabledRef.current) return;
      placeMarker(e.latlng.lat, e.latlng.lng);
    });

    if (initialLat !== undefined && initialLng !== undefined) {
      placeMarker(initialLat, initialLng);
      map.setView([initialLat, initialLng], zoom);
    }

    mapRef.current = map;
    setInitializing(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!disposed) map.invalidateSize();
      });
    });
    const ro = new ResizeObserver(() => {
      if (!disposed) map.invalidateSize();
    });
    ro.observe(container);

    return () => {
      disposed = true;
      ro.disconnect();
      if (tileTimeout) clearTimeout(tileTimeout);
      if (autoRetryTimer) clearTimeout(autoRetryTimer);
      tileLayer.off('load', onTileLoad);
      tileLayer.off('tileload', onTileLoad);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };

    function placeMarker(lat: number, lng: number) {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        const icon = L.divIcon({
          className: 'pin-marker',
          html: `<svg width="36" height="36" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="8"/></svg>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });
        markerRef.current = L.marker([lat, lng], { draggable: !disabledRef.current, icon }).addTo(map);
        markerRef.current.on('dragend', () => {
          const pos = markerRef.current!.getLatLng();
          onPinPlacedRef.current(pos.lat, pos.lng);
        });
      }
      onPinPlacedRef.current(lat, lng);
    }
  }, [retryKey]);

  const handleManualSet = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng)) return;
    onPinPlaced(lat, lng);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden" />

      {initializing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 rounded-lg z-10 gap-3 animate-pulse">
          <div className="w-12 h-12 rounded-full border-2 border-gray-600 border-t-gray-400 animate-spin" />
          <div className="h-3 w-24 rounded bg-gray-700" />
        </div>
      )}

      {autoRetrying && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 rounded-lg gap-3 p-4 z-10">
          <div className="animate-spin w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full" />
          <p className="text-gray-400 text-sm text-center">Tiles still loading…</p>
        </div>
      )}

      {tileLoadFailed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 rounded-lg gap-4 p-4 z-10">
          <p className="text-gray-400 text-sm text-center">Map tiles are taking a while to load.</p>
          <button
            onClick={() => setRetryKey((k) => k + 1)}
            className="px-4 py-2 bg-yellow-400 text-black text-sm font-medium rounded-lg hover:bg-yellow-300 transition-colors"
          >
            Retry
          </button>
          <div className="w-full max-w-xs space-y-2">
            <p className="text-xs text-gray-500 text-center">Or enter coordinates manually:</p>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Latitude"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                className="flex-1 px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-500"
                step="any"
              />
              <input
                type="number"
                placeholder="Longitude"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                className="flex-1 px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-500"
                step="any"
              />
            </div>
            <button
              onClick={handleManualSet}
              disabled={!manualLat || !manualLng}
              className="w-full px-3 py-1.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Set Pin
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
