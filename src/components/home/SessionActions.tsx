'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import { NotificationBadge } from '@/components/notifications/NotificationBadge';

interface SessionActionsProps {
  section: 'hero' | 'cta';
}

export function SessionActions({ section }: SessionActionsProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await authClient.getSession();
        if (active) setUserId(data?.user?.id ?? null);
      } catch {
        if (active) setUserId(null);
      } finally {
        if (active) setLoaded(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const primary = section === 'hero'
    ? 'w-full sm:w-auto px-8 py-3 rounded-lg bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors'
    : 'w-full sm:w-auto px-8 py-3 rounded-lg bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors';
  const secondary = 'w-full sm:w-auto px-8 py-3 rounded-lg border border-gray-700 text-white font-semibold hover:bg-gray-900 transition-colors';

  if (!loaded) {
    return (
      <div className="w-full sm:w-56 h-11 rounded-lg bg-gray-900 animate-pulse" />
    );
  }

  if (userId) {
    return section === 'hero' ? (
      <>
        <Link href="/game" className={primary}>Continue Investigation</Link>
        <Link href="/daily" className={secondary}>Daily Challenge</Link>
        <Link href="/case-file" className={secondary}>Case File</Link>
        <Link href="/leaderboard" className={secondary}>Leaderboard</Link>
        <Link href="/profile" className={secondary}>Profile</Link>
        <NotificationBadge userId={userId} />
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
