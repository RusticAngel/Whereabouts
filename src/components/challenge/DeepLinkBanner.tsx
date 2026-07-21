'use client';

import { useState, useEffect } from 'react';

export function DeepLinkBanner({ challengeId }: { challengeId: string }) {
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsMobile(/android|iphone|ipad|ipod/i.test(ua));
  }, []);

  if (!isMobile || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-400/10 border-b border-yellow-400/20 backdrop-blur-sm">
      <div className="max-w-lg mx-auto px-4 py-2 flex items-center justify-between">
        <p className="text-xs text-yellow-400">
          Open in app for the best experience
        </p>
        <div className="flex items-center gap-2">
          <a
            href={`findme://challenge/${challengeId}`}
            className="text-xs font-medium text-yellow-400 hover:text-yellow-300 underline"
          >
            Open App
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="text-xs text-gray-500 hover:text-gray-400"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
