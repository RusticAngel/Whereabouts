'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import { NotificationBadge } from '@/components/notifications/NotificationBadge';

const CACHE_KEY = 'findme_session_cache';

interface SessionActionsProps {
  section: 'hero' | 'cta';
}

export function SessionActions({ section }: SessionActionsProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [cachedSignedIn, setCachedSignedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    if (localStorage.getItem(CACHE_KEY) === 'logged-in') {
      setCachedSignedIn(true);
      setLoaded(true);
    }

    (async () => {
      try {
        const { data } = await authClient.getSession();
        if (!active) return;
        const id = data?.user?.id ?? null;
        setUserId(id);
        setLoaded(true);
        setCachedSignedIn(false);
        if (id) localStorage.setItem(CACHE_KEY, 'logged-in');
        else localStorage.removeItem(CACHE_KEY);
      } catch {
        if (!active) return;
        if (localStorage.getItem(CACHE_KEY) !== 'logged-in') setUserId(null);
        setCachedSignedIn(false);
        setLoaded(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const signedIn = Boolean(userId) || cachedSignedIn;

  const primary = section === 'hero'
    ? 'w-full sm:w-auto px-8 py-3 rounded-lg bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors'
    : 'w-full sm:w-auto px-8 py-3 rounded-lg bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors';
  const secondary = 'w-full sm:w-auto px-8 py-3 rounded-lg border border-gray-700 text-white font-semibold hover:bg-gray-900 transition-colors';

  if (!loaded) {
    return (
      <div className="w-full sm:w-56 h-11 rounded-lg bg-gray-900 animate-pulse" />
    );
  }

  if (signedIn) {
    return section === 'hero' ? (
      <>
        <Link href="/game" className={primary}>Continue Investigation</Link>
        <Link href="/daily" className={secondary}>Daily Challenge</Link>
        <Link href="/case-file" className={secondary}>Case File</Link>
        <Link href="/leaderboard" className={secondary}>Leaderboard</Link>
        <Link href="/profile" className={secondary}>Profile</Link>
        {userId && <NotificationBadge userId={userId} />}
      </>
    ) : (
      <>
        <Link href="/game" className={primary}>Continue Investigation</Link>
        <Link href="/case-file" className={secondary}>Case File</Link>
        <Link href="/leaderboard" className={secondary}>Leaderboard</Link>
      </>
    );
  }

  return section === 'hero' ? (
    <>
      <Link href="/auth" className={primary}>Start Tracking</Link>
      <Link href="/daily" className={secondary}>Daily Challenge</Link>
    </>
  ) : (
    <Link href="/auth" className={primary}>Start Tracking</Link>
  );
}
