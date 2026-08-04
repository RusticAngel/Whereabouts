'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

/**
 * Routes the global `findme://challenge/{id}` deep link into the in-app
 * `/challenge/{id}` page. Without this, opening the scheme just loads the
 * fixed server.url (Home) and the challenge would be unreachable in-app.
 */
export function DeepLinkRouter() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const routeChallenge = (url: string) => {
      const m = url.match(/findme:\/\/challenge\/([0-9a-f-]+)/i);
      if (!m) return;
      const id = m[1];
      if (!id) return;
      // Avoid clobbering the page we're already on.
      if (pathname === `/challenge/${id}`) return;
      router.push(`/challenge/${id}`);
    };

    const sub = App.addListener('appUrlOpen', (data) => {
      routeChallenge(data.url ?? '');
    });
    App.getLaunchUrl().then((res) => {
      if (res?.url) routeChallenge(res.url);
    });

    return () => {
      void sub.then((s) => s.remove());
    };
  }, [router, pathname]);

  return null;
}