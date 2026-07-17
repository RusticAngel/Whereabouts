'use client';

import { useEffect, useRef, useState } from 'react';
import { Viewer } from 'mapillary-js';
import 'mapillary-js/dist/mapillary.css';

interface StreetViewProps {
  imageId: string;
  className?: string;
}

export default function StreetView({ imageId, className = '' }: StreetViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [failed, setFailed] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;

    const accessToken = process.env.NEXT_PUBLIC_MAPILLARY_ACCESS_TOKEN;
    if (!accessToken) {
      setFailed(true);
      return;
    }

    if (container.clientWidth === 0 || container.clientHeight === 0) {
      requestAnimationFrame(() => {
        if (containerRef.current && !disposed) {
          initViewer(containerRef.current, accessToken);
        }
      });
      return;
    }

    initViewer(container, accessToken);

    return () => {
      disposed = true;
      const viewer = viewerRef.current;
      viewerRef.current = null;
      if (viewer) {
        Promise.resolve(viewer.remove()).catch(() => {});
      }
    };
  }, [imageId]);

  function initViewer(container: HTMLDivElement, accessToken: string, attempt = 1) {
    try {
      setRetrying(false);
      setFailed(false);
      viewerRef.current = new Viewer({
        accessToken,
        container,
        imageId,
        component: {
          cover: false,
          sequence: true,
          direction: true,
          keyboard: true,
          cache: false,
          bearing: false,
          attribution: false,
          zoom: true,
          pointer: true,
        },
      });
    } catch (e) {
      console.error('[StreetView] init error:', e);
      if (attempt < 2) {
        setRetrying(true);
        setTimeout(() => {
          if (containerRef.current) {
            initViewer(containerRef.current, accessToken, attempt + 1);
          }
        }, 5000);
      } else {
        setFailed(true);
        setRetrying(false);
      }
    }
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div
        ref={containerRef}
        className={`w-full h-full ${failed || retrying ? 'hidden' : ''}`}
      />
      {retrying && (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full" />
            <p className="text-gray-400 text-sm">Loading Street View…</p>
          </div>
        </div>
      )}
      {failed && (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Street View unavailable</p>
        </div>
      )}
    </div>
  );
}
