'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AddFriendModal } from '@/components/friends/AddFriendModal';
import { FriendListItem, FriendListItemData } from '@/components/friends/FriendListItem';
import { PendingRequest, getPendingRequests, getFriendList, acceptFriendRequest, rejectFriendRequest } from '@/app/actions';

interface FriendsPageProps {
  userId: string;
}

export function FriendsPage({ userId }: FriendsPageProps) {
  const [friends, setFriends] = useState<FriendListItemData[]>([]);
  const [pending, setPending] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    const [friendList, requests] = await Promise.all([getFriendList(userId), getPendingRequests(userId)]);
    setFriends(friendList.map((f) => ({ ...f, lastActiveAt: f.lastActiveAt })));
    setPending(requests);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [friendList, requests] = await Promise.all([getFriendList(userId), getPendingRequests(userId)]);
      if (cancelled) return;
      setFriends(friendList.map((f) => ({ ...f, lastActiveAt: f.lastActiveAt })));
      setPending(requests);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleAccept = async (requestId: string) => {
    await acceptFriendRequest(requestId);
    await load();
  };

  const handleReject = async (requestId: string) => {
    await rejectFriendRequest(requestId);
    await load();
  };

  return (
    <main className="flex flex-col min-h-dvh bg-black text-white">
      <div className="w-full max-w-md mx-auto p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            &larr; Home
          </Link>
          <h1 className="text-lg font-semibold">Friends</h1>
          <div className="w-10" />
        </div>

        <div className="flex gap-3">
          <input
            placeholder="🔍 Search by username..."
            className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            onKeyDown={(e) => {
              if (e.key === 'Enter') setModalOpen(true);
            }}
          />
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            + Add Friend
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-16 rounded-xl bg-gray-900 animate-pulse" />
            <div className="h-16 rounded-xl bg-gray-900 animate-pulse" />
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Pending Requests ({pending.length})
                </h2>
                {pending.map((r) => (
                  <div
                    key={r.requestId}
                    className="flex items-center justify-between rounded-xl bg-gray-900 border border-gray-800 p-4"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{r.username}</div>
                      <div className="text-xs text-gray-400 truncate">{r.title} · Level {r.level}</div>
                    </div>
                    <div className="flex gap-2 shrink-0 ml-3">
                      <Button size="sm" variant="primary" onClick={() => handleAccept(r.requestId)}>
                        Accept
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleReject(r.requestId)}>
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </section>
            )}

            <section className="space-y-3">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Your Friends ({friends.length})
              </h2>
              {friends.length === 0 ? (
                <div className="rounded-xl bg-gray-900/50 border border-gray-800 p-6 text-center">
                  <div className="text-3xl mb-2">🤝</div>
                  <p className="text-sm text-gray-400">
                    No friends yet. Search for a username above to send your first request.
                  </p>
                </div>
              ) : (
                friends.map((f) => <FriendListItem key={f.userId} friend={f} />)
              )}
            </section>
          </>
        )}
      </div>

      {modalOpen && <AddFriendModal onClose={() => setModalOpen(false)} onRequestSent={load} />}
    </main>
  );
}
