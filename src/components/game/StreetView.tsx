'use client';

import { useEffect, useRef, useState } from 'react';
import { Viewer, ViewerOptions } from 'mapillary-js';
import 'mapillary-js/dist/mapillary.css';
import { Difficulty } from '@/lib/game/scoring';

const LOAD_TIMEOUT_MS = 20000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 5000;

const accessToken = process.env.NEXT_PUBLIC_MAPILLARY_ACCESS_TOKEN;

interface StreetViewProps {
  imageId: string;
  className?: string;
  difficulty?: Difficulty;
}

const DIFFICULTY_CONFIG: Record<Difficulty, ViewerOptions['component']> = {
  move: {
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
  'no-move': {
    cover: false,
    sequence: false,
    direction: true,
    keyboard: false,
    cache: false,
    bearing: false,
    attribution: false,
    zoom: true,
    pointer: false,
  },
  nmpz: {
    cover: false,
    sequence: false,
    direction: false,
    keyboard: false,
    cache: false,
    bearing: false,
    attribution: false,
    zoom: false,
    pointer: false,
  },
};

export default function StreetView({ imageId, className = '', difficulty = 'move' }: StreetViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!accessToken) return;

    let disposed = false;
    let attempt = 0;
    let loadTimeout: ReturnType<typeof setTimeout> | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const clearTimers = () => {
      if (loadTimeout) clearTimeout(loadTimeout);
      if (retryTimer) clearTimeout(retryTimer);
      loadTimeout = null;
      retryTimer = null;
    };

    const handleLoad = (ok: boolean) => {
      if (disposed) return;
      clearTimers();
      setLoading(false);
      if (!ok) {
        if (attempt < MAX_RETRIES) {
          attempt += 1;
          retryTimer = setTimeout(() => {
            if (!disposed) initViewer();
          }, RETRY_DELAY_MS);
        } else {
          setFailed(true);
        }
      }
    };

    const initViewer = () => {
      if (disposed) return;
      setLoading(true);
      setFailed(false);

      try {
        const viewer = new Viewer({
          accessToken,
          container: containerRef.current!,
          imageId,
          component: DIFFICULTY_CONFIG[difficulty],
        });

        viewerRef.current = viewer;

        const onLoad = () => handleLoad(true);
        viewer.on('load', onLoad);

        viewer.moveTo(imageId).then(
          () => handleLoad(true),
          () => handleLoad(false),
        );

        loadTimeout = setTimeout(() => handleLoad(false), LOAD_TIMEOUT_MS);
      } catch {
        handleLoad(false);
      }
    };

    initViewer();

    return () => {
      disposed = true;
      clearTimers();
      if (viewerRef.current) {
        Promise.resolve(viewerRef.current.remove()).catch(() => {});
        viewerRef.current = null;
      }
    };
  }, [imageId, retryKey, difficulty]);

  const showFailed = failed || !accessToken;

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div
        ref={containerRef}
        className={`w-full h-full transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'} ${showFailed ? 'hidden' : ''}`}
      />
      {loading && !showFailed && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full" />
            <p className="text-gray-400 text-sm">Loading Street View…</p>
          </div>
        </div>
      )}
      {showFailed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-900">
          <p className="text-gray-400 text-sm">Street View unavailable</p>
          <button
            onClick={() => setRetryKey((k) => k + 1)}
            className="px-4 py-2 bg-yellow-400 text-black text-sm font-medium rounded-lg hover:bg-yellow-300 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}