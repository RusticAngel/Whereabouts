'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getDailyLeaderboard, getLeaderboardCampaign, getLeaderboardLevel, updateNickname } from '@/app/actions';
import { Button } from '@/components/ui/Button';

type Tab = 'daily' | 'campaign' | 'level';

interface Entry {
  rank: number;
  username: string;
  score: number;
  isCurrentUser: boolean;
}

export function LeaderboardClient({ userId, currentNickname }: { userId: string; currentNickname: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('daily');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelInput, setLevelInput] = useState('1');
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(currentNickname);
  const [saving, setSaving] = useState(false);

  const handleSaveNickname = useCallback(async () => {
    setSaving(true);
    await updateNickname(userId, nickname);
    setEditing(false);
    setSaving(false);
    setTab((t) => t); // trigger re-render
  }, [userId, nickname]);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    (async () => {
      setLoading(true);
      let data: { username: string; score: number; userId: string }[] = [];

      if (tab === 'daily') {
        const today = new Date().toISOString().split('T')[0];
        const dailyData = await getDailyLeaderboard(today);
        data = dailyData.map((d) => ({
          username: d.username,
          score: d.score,
          userId: d.userId,
        }));
      } else if (tab === 'campaign') {
        const campaignData = await getLeaderboardCampaign();
        data = campaignData.map((d) => ({
          username: d.username,
          score: d.totalScore,
          userId: d.userId,
        }));
      } else {
        const level = parseInt(levelInput) || 1;
        const levelData = await getLeaderboardLevel(level);
        data = levelData.map((d) => ({
          username: d.username,
          score: d.totalScore,
          userId: d.userId,
        }));
      }

      setEntries(
        data.map((d, i) => ({
          rank: i + 1,
          username: d.username ?? 'Anonymous',
          score: d.score,
          isCurrentUser: d.userId === userId,
        }))
      );
      setLoading(false);
    })();
  }, [tab, levelInput, userId, today]);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'daily', label: 'Daily' },
    { key: 'campaign', label: 'Campaign' },
    { key: 'level', label: 'Level' },
  ];

  return (
    <div className="flex flex-col min-h-dvh bg-black text-white">
      <div className="p-4 max-w-lg mx-auto w-full flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => router.push('/')} className="text-sm text-gray-400 hover:text-white transition-colors">&larr; Home</button>
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <div className="w-12" />
        </div>

        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.key
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'level' && (
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-400">Level</label>
            <input
              type="number"
              min={1}
              max={28}
              value={levelInput}
              onChange={(e) => setLevelInput(e.target.value)}
              className="w-20 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm text-center"
            />
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-1">
            {entries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No scores yet.</div>
            ) : (
              entries.map((entry) => (
                <div
                  key={`${entry.rank}-${entry.username}`}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg ${
                    entry.isCurrentUser ? 'bg-white/10 border border-white/20' : 'bg-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-center text-sm font-bold ${
                      entry.rank <= 3 ? 'text-yellow-400' : 'text-gray-500'
                    }`}>
                      {entry.rank}
                    </span>
                    {entry.isCurrentUser && editing ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                          maxLength={30}
                          className="w-28 px-2 py-1 text-sm bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-500"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveNickname}
                          disabled={saving || !nickname.trim()}
                          className="text-xs px-2 py-1 rounded bg-yellow-400 text-black font-medium hover:bg-yellow-300 disabled:opacity-50"
                        >
                          {saving ? '...' : 'Save'}
                        </button>
                        <button
                          onClick={() => { setEditing(false); setNickname(currentNickname); }}
                          className="text-xs text-gray-500 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="text-white">{entry.username}</span>
                    )}
                    {entry.isCurrentUser && !editing && (
                      <>
                        <span className="text-xs text-gray-500">(you)</span>
                        <button onClick={() => { setNickname(currentNickname); setEditing(true); }} className="text-xs text-gray-500 hover:text-white ml-1">
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                  <span className="text-white font-mono">{entry.score.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button fullWidth variant="primary" onClick={() => router.push('/game')}>
            Continue Trail
          </Button>
          <Button fullWidth variant="secondary" onClick={() => router.push('/case-file')}>
            Case File
          </Button>
        </div>
        <button onClick={() => router.push('/')} className="w-full py-2.5 rounded-lg border border-gray-700 text-gray-400 font-medium text-sm hover:text-white hover:border-gray-500 transition-colors">
          Back to Home
        </button>
      </div>
    </div>
  );
}
