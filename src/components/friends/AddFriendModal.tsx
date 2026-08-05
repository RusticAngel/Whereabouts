'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { searchUsers, sendFriendRequest, FriendSearchResult } from '@/app/actions';

interface AddFriendModalProps {
  onClose: () => void;
  onRequestSent: () => void;
}

export function AddFriendModal({ onClose, onRequestSent }: AddFriendModalProps) {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FriendSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [sentMap, setSentMap] = useState<Record<string, 'sent' | 'pending_exists' | 'auto_accepted' | 'already_friends'>>({});

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const q = query.trim();
      if (q.length < 3) {
        setResults([]);
        setSearching(false);
        return;
      }
      setSearching(true);
      await new Promise((resolve) => setTimeout(resolve, 350));
      if (cancelled) return;
      const res = await searchUsers(q);
      if (cancelled) return;
      setResults(res);
      setSearching(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const handleAdd = async (userId: string) => {
    const status = await sendFriendRequest(userId);
    setSentMap((prev) => ({ ...prev, [userId]: status }));
    if (status === 'auto_accepted') onRequestSent();
  };

  const labelFor = (status: 'sent' | 'pending_exists' | 'auto_accepted' | 'already_friends') => {
    switch (status) {
      case 'sent':
      case 'pending_exists':
        return 'Pending';
      case 'auto_accepted':
        return 'Added';
      case 'already_friends':
        return 'Friends';
      default:
        return 'Add';
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl transition-all duration-500 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Add Friend</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-3">Search for a user by username.</p>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Enter username..."
          className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
        />

        {query.trim().length >= 3 && (
          <div className="mt-4 space-y-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Search Results</div>
            {searching ? (
              <div className="text-sm text-gray-500 py-2">Searching…</div>
            ) : results.length === 0 ? (
              <div className="text-sm text-gray-500 py-2">No more results</div>
            ) : (
              results.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-xl bg-gray-800/50 border border-gray-800 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate">{r.username}</div>
                    <div className="text-xs text-gray-400 truncate">{r.title} · Level {r.level}</div>
                  </div>
                  <Button
                    size="sm"
                    variant={sentMap[r.id] ? 'ghost' : 'primary'}
                    disabled={Boolean(sentMap[r.id])}
                    onClick={() => handleAdd(r.id)}
                  >
                    {sentMap[r.id] ? labelFor(sentMap[r.id]) : 'Add'}
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
