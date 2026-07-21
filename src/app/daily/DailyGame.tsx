'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { LocationData, Confidence } from '@/types';
import { calculateDistance } from '@/lib/game/pin';
import { calculateFinalScore, getNarrativeFeedback, applyStreakMultiplier } from '@/lib/game';
import { evidenceCost } from '@/lib/game/evidence';
import { EvidencePanel } from '@/components/game/EvidencePanel';
import { ConfidenceSelector } from '@/components/game/ConfidenceSelector';
import { HintPanel } from '@/components/game/HintPanel';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ResultCard } from '@/components/results/ResultCard';
import { ShareButton } from '@/components/results/ShareButton';
import { saveRound, upsertDailyScore, getProfileStreak, createChallenge } from '@/app/actions';
import { shareChallenge } from '@/lib/share';

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

interface DailyGameProps {
  location: LocationData;
  userId: string;
  date: string;
  existingScore: number | null;
}

export function DailyGame({ location, userId, date, existingScore }: DailyGameProps) {
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
  const [streak, setStreak] = useState(0);
  const [challengeCopied, setChallengeCopied] = useState(false);
  const [hintsCount, setHintsCount] = useState(0);
  const savingRef = useRef(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const hasCoords = location.lat && location.lng;

  useEffect(() => {
    if (existingScore !== null) return;
    (async () => {
      const data = await getProfileStreak(userId);
      setStreak(data.streak);
    })();
  }, [userId, existingScore]);

  const handleSubmit = useCallback(async () => {
    if (savingRef.current || pinLat === null || pinLng === null || !hasCoords || existingScore !== null) return;
    savingRef.current = true;
    setSaving(true);

    const actualLat = parseFloat(location.lat!);
    const actualLng = parseFloat(location.lng!);
    const distanceKm = Math.round(calculateDistance(pinLat, pinLng, actualLat, actualLng));
    const baseScore = calculateFinalScore(distanceKm, evidenceRevealed, confidence);
    const totalScore = applyStreakMultiplier(baseScore, streak);
    const pinScore = calculateFinalScore(distanceKm, 0, 'low');

    const roundId = await saveRound(
      userId,
      location.id,
      0,
      totalScore,
      true,
      {
        pinGuessLat: String(pinLat),
        pinGuessLng: String(pinLng),
        pinScore,
        evidenceRevealed,
        confidence,
        distanceKm,
      }
    );

    if (roundId) {
      await upsertDailyScore(userId, date, totalScore, undefined, distanceKm);
      setResult({ distanceKm, pinScore: totalScore, totalScore });
      setPhase('results');
    }
    setSaving(false);
    savingRef.current = false;
  }, [pinLat, pinLng, evidenceRevealed, confidence, location.lat, location.lng, location.id, userId, date, hasCoords, existingScore, streak]);

  const handleHint = useCallback(() => {
    setHintsCount((c) => c + 1);
  }, []);

  const handleChallengeFriends = useCallback(async () => {
    const newChallengeId = await createChallenge();
    if (!newChallengeId) return;

    const shareUrl = `${window.location.origin}/challenge/${newChallengeId}`;
    const shareText = `I scored ${result?.totalScore.toLocaleString()} on today's FindMe daily! Think you can beat me? 🌍`;

    await shareChallenge(shareText, shareUrl, setChallengeCopied);
  }, [result]);

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

    return (
      <div className="flex flex-col min-h-dvh bg-black text-white p-4 animate-fade-in">
        <div className="max-w-lg mx-auto w-full space-y-6">
          <ResultCard
            ref={cardRef}
            score={result.totalScore}
            distanceKm={result.distanceKm}
            label={`Daily — ${date}`}
            streak={streak}
          />

          <ShareButton
            targetRef={cardRef}
            shareText={`Today's FindMe daily: ${result.totalScore.toLocaleString()} pts — ${result.distanceKm.toLocaleString()} km away 🌍`}
          />

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
                <span className="text-white font-mono">
                  {result.distanceKm.toLocaleString()} km
                </span>
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

          {streak > 0 && (
            <div className="text-center text-sm text-yellow-400">
              🔥 {streak}-day streak (×{((1 + Math.min(streak, 5) * 0.05).toFixed(2))} multiplier)
            </div>
          )}
          <Button fullWidth variant="primary" onClick={handleChallengeFriends}>
            {challengeCopied ? 'Copied!' : 'Challenge Friends'}
          </Button>
          <Button fullWidth variant="secondary" onClick={() => window.location.reload()}>
            Run it again
          </Button>
          <Button fullWidth variant="secondary" onClick={() => router.push('/game')}>
            Back on patrol
          </Button>
          <Button fullWidth variant="outline" onClick={() => router.push('/leaderboard')}>
            Leaderboard
          </Button>
          <Button fullWidth variant="ghost" onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (existingScore !== null) {
    return (
      <div className="flex flex-col min-h-dvh bg-black text-white items-center justify-center p-4 animate-fade-in">
        <p className="text-gray-400 text-center">Today&apos;s sighting is already in the system.</p>
        <p className="text-yellow-400 font-mono text-lg mt-2">Score: {existingScore.toLocaleString()}</p>
        <div className="flex flex-col gap-3 mt-6 w-full max-w-xs">
          <Button fullWidth variant="primary" onClick={() => router.push('/game')}>
            Back on patrol
          </Button>
          <Button fullWidth variant="outline" onClick={() => router.push('/leaderboard')}>
            Leaderboard
          </Button>
          <Button fullWidth variant="ghost" onClick={() => router.push('/')}>
            Back to Home
          </Button>
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
              Daily — {date}
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
            <HintPanel
              pinLat={pinLat}
              pinLng={pinLng}
              targetLat={parseFloat(location.lat!)}
              targetLng={parseFloat(location.lng!)}
              hintsUsed={hintsCount}
              confidence={confidence}
              onHint={handleHint}
            />
          )}

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
            Daily Cipher Sighting — {date}
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
