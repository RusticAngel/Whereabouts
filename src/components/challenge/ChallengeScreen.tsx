'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { LocationData, Confidence, ChallengeResultData } from '@/types';
import { calculateDistance } from '@/lib/game/pin';
import { calculateFinalScore, getNarrativeFeedback } from '@/lib/game';
import { evidenceCost } from '@/lib/game/evidence';
import { EvidencePanel } from '@/components/game/EvidencePanel';
import { ConfidenceSelector } from '@/components/game/ConfidenceSelector';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ResultCard } from '@/components/results/ResultCard';
import { ShareButton } from '@/components/results/ShareButton';
import { saveChallengeResult, getChallenge, createChallenge, createRematchChallenge, getFocusedLeaderboard } from '@/app/actions';

const StreetView = dynamic(() => import('@/components/game/StreetView'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-900" />,
});

const PinMap = dynamic(() => import('@/components/game/PinMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-800 flex items-center justify-center animate-pulse"><div className="w-10 h-10 rounded-full border-2 border-gray-600 border-t-gray-400 animate-spin" /></div>,
});

const ResultsMap = dynamic(() => import('@/components/results/ResultsMap'), {
  ssr: false,
  loading: () => <div className="w-full h-48 bg-gray-800 rounded-lg animate-pulse" />,
});

interface ChallengeScreenProps {
  challengeId: string;
  location: LocationData;
  userId: string;
}

export function ChallengeScreen({ challengeId, location, userId }: ChallengeScreenProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<'exploring' | 'pinning' | 'results'>('exploring');
  const [pinLat, setPinLat] = useState<number | null>(null);
  const [pinLng, setPinLng] = useState<number | null>(null);
  const [evidenceRevealed, setEvidenceRevealed] = useState(0);
  const [confidence, setConfidence] = useState<Confidence>('low');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{
    distanceKm: number;
    pinScore: number;
    totalScore: number;
  } | null>(null);
  const [focusedAbove, setFocusedAbove] = useState<ChallengeResultData | null>(null);
  const [focusedBelow, setFocusedBelow] = useState<ChallengeResultData | null>(null);
  const [allResults, setAllResults] = useState<ChallengeResultData[]>([]);
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);
  const [playsCount, setPlaysCount] = useState(0);
  const [rematchId, setRematchId] = useState<string | null>(null);
  const [rematching, setRematching] = useState(false);
  const [copied, setCopied] = useState(false);
  const savingRef = useRef(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const hasCoords = location.lat && location.lng;

  const handleSubmit = useCallback(async () => {
    if (savingRef.current || pinLat === null || pinLng === null || !hasCoords) return;
    savingRef.current = true;
    setSaving(true);

    const actualLat = parseFloat(location.lat!);
    const actualLng = parseFloat(location.lng!);
    const distanceKm = Math.round(calculateDistance(pinLat, pinLng, actualLat, actualLng));
    const totalScore = calculateFinalScore(distanceKm, evidenceRevealed, confidence);
    const pinScore = calculateFinalScore(distanceKm, 0, 'low');

    await saveChallengeResult(challengeId, userId, {
      score: totalScore,
      distanceKm,
      evidenceRevealed,
      confidence,
    });

    const [challengeData, focused] = await Promise.all([
      getChallenge(challengeId),
      getFocusedLeaderboard(challengeId, userId),
    ]);
    if (challengeData) {
      setPlaysCount(challengeData.playsCount);
      setRematchId(challengeData.rematchOf);
    }
    setFocusedAbove(focused.above);
    setFocusedBelow(focused.below);
    setAllResults(focused.allResults);

    setResult({ distanceKm, pinScore: totalScore, totalScore });
    setPhase('results');
    setSaving(false);
    savingRef.current = false;
  }, [pinLat, pinLng, evidenceRevealed, confidence, location.lat, location.lng, challengeId, userId, hasCoords]);

  const handleChallengeFriends = useCallback(async () => {
    const newChallengeId = await createChallenge();
    if (!newChallengeId) return;

    const shareUrl = `${window.location.origin}/challenge/${newChallengeId}`;
    const shareText = `Think you can track Cipher? Take on my challenge! 🌍`;

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'FindMe Challenge', text: shareText, url: shareUrl });
      } catch { }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        alert(`Share this link with your friends:\n\n${shareUrl}`);
      }
    }
  }, [userId]);

  if (saving) {
    return (
      <div className="flex flex-col min-h-dvh bg-black text-white items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mb-4" />
        <p className="text-gray-400 text-sm">Transmitting intel…</p>
      </div>
    );
  }

  if (phase === 'results' && result) {
    const evidenceDeduction = evidenceCost(evidenceRevealed);
    const baseScore = result.pinScore + evidenceDeduction;
    const isHighCorrect = confidence === 'high' && result.distanceKm < 100;
    const isHighWrong = confidence === 'high' && result.distanceKm >= 100;
    const confidenceLabel = confidence.charAt(0).toUpperCase() + confidence.slice(1);

    const totalPlayers = allResults.length;

    const isAlone = totalPlayers <= 1;
    const isFirst = !focusedAbove && !!focusedBelow;
    const isLast = !focusedBelow && !!focusedAbove;
    const showFocused = totalPlayers >= 3;
    const rank = allResults.findIndex(r => r.userId === userId) + 1;

    const handleRematch = async () => {
      setRematching(true);
      const newId = await createRematchChallenge(challengeId, userId);
      if (newId) {
        const shareUrl = `${window.location.origin}/challenge/${newId}`;
        const shareText = `Rematch! Same players, new location. Think you can beat me? 🌍`;
        if (typeof navigator.share === 'function') {
          try { await navigator.share({ title: 'FindMe Rematch', text: shareText, url: shareUrl }); } catch { }
        } else {
          try { await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`); } catch { }
        }
      }
      setRematching(false);
    };

    return (
      <div className="flex flex-col min-h-dvh bg-black text-white p-4 animate-fade-in">
        <div className="max-w-lg mx-auto w-full space-y-6">
          <ResultCard
            ref={cardRef}
            score={result.totalScore}
            distanceKm={result.distanceKm}
            rank={totalPlayers >= 2 ? rank : undefined}
            totalPlayers={totalPlayers >= 2 ? totalPlayers : undefined}
            aboveName={focusedAbove?.username}
            aboveDistance={focusedAbove?.distanceKm}
            belowName={focusedBelow?.username}
            belowDistance={focusedBelow?.distanceKm}
            isFirst={isFirst}
            isLast={isLast}
            label="Challenge"
          />

          <ShareButton
            targetRef={cardRef}
            shareText={`I placed #${rank} of ${totalPlayers} on FindMe! Score: ${result.totalScore.toLocaleString()} pts 🌍`}
          />

          <Card>
            <div className={`rounded-xl border p-4 text-center text-sm font-medium ${
              result.distanceKm < 1
                ? 'text-green-400 border-green-400/30 bg-green-400/10'
                : result.distanceKm < 50
                  ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
                  : result.distanceKm < 1000
                    ? 'text-orange-400 border-orange-400/30 bg-orange-400/10'
                    : 'text-red-400 border-red-400/30 bg-red-400/10'
            }`}>
              {getNarrativeFeedback(result.distanceKm)}
            </div>
          </Card>

          <div className="text-center mb-2">
            <p className="text-3xl sm:text-4xl font-bold text-white">
              You were <span className="text-yellow-400">{result.distanceKm.toLocaleString()} km</span> away
            </p>
          </div>

          <Card>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Mission Report</h3>
            <ResultsMap
              guessLat={pinLat}
              guessLng={pinLng}
              actualLat={parseFloat(location.lat!)}
              actualLng={parseFloat(location.lng!)}
              distanceKm={result.distanceKm}
            />
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Distance</span>
                <span className="text-white font-mono">{result.distanceKm.toLocaleString()} km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Accuracy Score</span>
                <span className="text-white font-mono">{baseScore}</span>
              </div>
              {evidenceRevealed > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-red-400">Intel Cost ({evidenceRevealed})</span>
                  <span className="text-red-400 font-mono">-{evidenceDeduction}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Confidence ({confidenceLabel})</span>
                <span className={`font-mono ${isHighCorrect ? 'text-green-400' : isHighWrong ? 'text-red-400' : 'text-blue-400'}`}>
                  {isHighCorrect ? '×1.5' : isHighWrong ? '÷2' : confidence === 'medium' ? '×1.2' : '×1.0'}
                </span>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between text-sm font-semibold">
                <span>Total</span>
                <span className="text-yellow-400 font-mono">{result.totalScore.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {totalPlayers >= 2 && (
            <Card>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {showFocused && !showFullLeaderboard ? 'Challenge Standings' : 'Leaderboard'}
              </h3>
              <div className="space-y-2 text-sm">
                {(showFocused && !showFullLeaderboard ? (
                  <>
                    {focusedAbove && (
                      <div className="flex justify-between items-center text-gray-300">
                        <span><span className="text-gray-500 mr-2">⬆️</span>{focusedAbove.username}</span>
                        <span className="font-mono">{focusedAbove.score.toLocaleString()} pts</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-yellow-400 border-y border-gray-700 py-1">
                      <span><span className="text-yellow-500 mr-2">👉</span>You</span>
                      <span className="font-mono">{result.totalScore.toLocaleString()} pts</span>
                    </div>
                    {focusedBelow && (
                      <div className="flex justify-between items-center text-gray-300">
                        <span><span className="text-gray-500 mr-2">⬇️</span>{focusedBelow.username}</span>
                        <span className="font-mono">{focusedBelow.score.toLocaleString()} pts</span>
                      </div>
                    )}
                  </>
                ) : (
                  allResults.map((r, i) => (
                    <div key={r.id} className={`flex justify-between items-center ${r.userId === userId ? 'text-yellow-400' : 'text-gray-300'}`}>
                      <span className="flex items-center gap-2">
                        <span className="text-gray-500 w-5 text-right">{i + 1}.</span>
                        {r.username}
                        {r.userId === userId && <span className="text-[10px] text-yellow-500">(you)</span>}
                      </span>
                      <span className="font-mono">{r.score.toLocaleString()} pts</span>
                    </div>
                  ))
                ))}
              </div>
              {showFocused && (
                <button
                  onClick={() => setShowFullLeaderboard(!showFullLeaderboard)}
                  className="w-full text-xs text-gray-500 hover:text-gray-300 transition-colors mt-3"
                >
                  {showFullLeaderboard ? 'Show less' : 'View Full Leaderboard'}
                </button>
              )}
            </Card>
          )}

          <div className="flex flex-col gap-3">
            <Button fullWidth variant="primary" onClick={handleChallengeFriends}>
              {copied ? 'Copied!' : 'Challenge Friends'}
            </Button>
            <Button fullWidth variant="secondary" onClick={handleRematch} disabled={rematching}>
              {rematching ? 'Creating rematch…' : '🔥 New Round (Can you beat them?)'}
            </Button>
            <Button fullWidth variant="secondary" onClick={() => window.location.reload()}>
              Run it again
            </Button>
            <Button fullWidth variant="secondary" onClick={() => router.push('/game')}>
              Back on patrol
            </Button>
            <Button fullWidth variant="ghost" onClick={() => router.push('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const canSubmit = pinLat !== null && pinLng !== null;

  if (phase === 'pinning') {
    return (
      <div className="h-dvh bg-black text-white flex flex-col animate-fade-in">
        <div className="shrink-0 px-4 pt-4 max-w-lg mx-auto w-full">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPhase('exploring')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              &larr; Reopen the scene
            </button>
            <div className="text-xs text-yellow-400 font-mono uppercase tracking-widest">
              Challenge
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 px-4 max-w-lg mx-auto w-full mt-2">
          <div className="h-full rounded-lg overflow-hidden border border-gray-700">
            <PinMap
              onPinPlaced={(lat, lng) => { setPinLat(lat); setPinLng(lng); }}
              zoom={3}
            />
          </div>
        </div>

        <div className="shrink-0 px-4 pb-8 max-w-lg mx-auto w-full space-y-3 mt-3">
          {canSubmit && (
            <ConfidenceSelector value={confidence} onChange={setConfidence} />
          )}

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            fullWidth
            variant="primary"
          >
            Lock in your findings
          </Button>

          <button
            onClick={() => router.push('/')}
            className="w-full text-sm text-gray-500 hover:text-white transition-colors text-center"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-dvh bg-black text-white overflow-hidden animate-fade-in">
      {location.provider === 'mapillary' && location.mapillary_id ? (
        <div className="absolute inset-0">
          <StreetView imageId={location.mapillary_id} />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gray-900" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            &larr; Home
          </button>
          <div className="text-xs text-yellow-400 font-mono uppercase tracking-widest">
            Challenge
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 pb-24 space-y-3">
        <EvidencePanel evidence={location.evidence} onReveal={setEvidenceRevealed} />

        <button
          onClick={() => setPhase('pinning')}
          className="w-full py-3 px-6 rounded-lg bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors active:scale-[0.98]"
        >
          Place your guess
        </button>
      </div>
    </div>
  );
}
