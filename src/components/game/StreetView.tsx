'use client';

import { useEffect, useRef, useState } from 'react';
import { Viewer } from 'mapillary-js';
import 'mapillary-js/dist/mapillary.css';

interface StreetViewProps {
  imageId: string;
  className?: string;
}

export default function StreetView({ imageId, className = '' }: StreetViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const initializedRef = useRef(false);
  const retryRef = useRef(false);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const accessToken = process.env.NEXT_PUBLIC_MAPILLARY_ACCESS_TOKEN;
    if (!accessToken) {
      setFailed(true);
      setLoading(false);
      return;
    }

    if (initializedRef.current) return;

    try {
      const viewer = new Viewer({
        accessToken,
        container,
        imageId,
        component: {
          cover: false,
          sequence: false,
          direction: true,
          keyboard: true,
          cache: false,
          bearing: false,
          attribution: false,
          zoom: true,
          pointer: true,
        },
      });

      viewerRef.current = viewer;
      initializedRef.current = true;
      setLoading(false);
    } catch {
      if (!retryRef.current) {
        retryRef.current = true;
        setTimeout(() => {
          if (containerRef.current && !initializedRef.current) {
            try {
              const viewer = new Viewer({
                accessToken,
                container: containerRef.current,
                imageId,
              component: {
                cover: false,
                sequence: false,
                direction: true,
                keyboard: true,
                cache: false,
                bearing: false,
                attribution: false,
                zoom: true,
                pointer: true,
              },
              });
              viewerRef.current = viewer;
              initializedRef.current = true;
              setLoading(false);
              return;
            } catch {}
          }
          setFailed(true);
          setLoading(false);
        }, 5000);
      } else {
        setFailed(true);
        setLoading(false);
      }
    }

    return () => {
      if (viewerRef.current) {
        Promise.resolve(viewerRef.current.remove()).catch(() => {});
        viewerRef.current = null;
        initializedRef.current = false;
        retryRef.current = false;
      }
    };
  }, []);

  useEffect(() => {
    if (!viewerRef.current || !imageId) return;
    setLoading(true);
    viewerRef.current.moveTo(imageId).then(() => {
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [imageId]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div
        ref={containerRef}
        className={`w-full h-full transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'} ${failed ? 'hidden' : ''}`}
      />
      {loading && !failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full" />
            <p className="text-gray-400 text-sm">Loading Street View…</p>
          </div>
        </div>
      )}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <p className="text-gray-400 text-sm">Street View unavailable</p>
        </div>
      )}
    </div>
  );
}
