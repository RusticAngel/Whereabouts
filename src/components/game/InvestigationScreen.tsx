'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { LocationData, Confidence } from '@/types';
import { calculateDistance } from '@/lib/game/pin';
import { calculateFinalScore } from '@/lib/game';
import { saveRound, advanceLevel } from '@/app/actions';
import { trackEvent } from '@/lib/game/analytics';
import { BriefingPanel } from './BriefingPanel';
import { EvidencePanel } from './EvidencePanel';
import { ConfidenceSelector } from './ConfidenceSelector';
import { HintPanel } from './HintPanel';
import { OnboardingModal } from './OnboardingModal';
import { Button } from '@/components/ui/Button';

const StreetView = dynamic(() => import('./StreetView'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-900" />,
});

const PinMap = dynamic(() => import('./PinMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-800 flex items-center justify-center"><p className="text-gray-500">Loading map…</p></div>,
});

interface InvestigationScreenProps {
  location: LocationData;
  userId: string;
  level: number;
  isReplay?: boolean;
}

export function InvestigationScreen({ location, userId, level, isReplay = false }: InvestigationScreenProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<'briefing' | 'onboarding' | 'exploring' | 'pinning' | 'saving'>(() => {
    if (level === 1 && typeof window !== 'undefined' && !localStorage.getItem('trace_onboarding_seen')) {
      return 'onboarding';
    }
    return 'briefing';
  });
  const [pinLat, setPinLat] = useState<number | null>(null);
  const [pinLng, setPinLng] = useState<number | null>(null);
  const [evidenceRevealed, setEvidenceRevealed] = useState(0);
  const [confidence, setConfidence] = useState<Confidence>('low');
  const [hintsCount, setHintsCount] = useState(0);
  const [saveFailed, setSaveFailed] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const savingRef = useRef(false);
  const pinTrackedRef = useRef(false);
  const startedRef = useRef(false);

  const hasCoords = location.lat && location.lng;

  useEffect(() => {
    if (phase === 'exploring' && !startedRef.current) {
      startedRef.current = true;
      trackEvent('game_started', { level });
    }
  }, [phase, level]);

  useEffect(() => {
    if (pinLat !== null && pinLng !== null && !pinTrackedRef.current) {
      pinTrackedRef.current = true;
      trackEvent('pin_placed', { level });
    }
  }, [pinLat, pinLng, level]);

  useEffect(() => {
    if (phase !== 'exploring') return;
    if (timeLeft <= 0) {
      setTimeUp(true);
      return;
    }
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setTimeUp(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, timeLeft]);

  const handleReveal = useCallback((count: number) => {
    setEvidenceRevealed(count);
    trackEvent('evidence_revealed', { level, evidenceUsed: count });
  }, [level]);

  const handleHint = useCallback(() => {
    const next = hintsCount + 1;
    setHintsCount(next);
    trackEvent('hint_used', { level, hintsUsed: next });
  }, [hintsCount, level]);

  const handleSubmit = useCallback(async () => {
    if (savingRef.current || pinLat === null || pinLng === null || !hasCoords) return;
    savingRef.current = true;
    setPhase('saving');

    const actualLat = parseFloat(location.lat!);
    const actualLng = parseFloat(location.lng!);
    const distanceKm = Math.round(calculateDistance(pinLat, pinLng, actualLat, actualLng));
    const pinScore = calculateFinalScore(distanceKm, evidenceRevealed, confidence);

    trackEvent('report_submitted', { level, distance: distanceKm, score: pinScore, confidence, evidenceUsed: evidenceRevealed, evidenceCount: evidenceRevealed });

    const roundId = await saveRound(
      userId,
      location.id,
      level,
      pinScore,
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
      trackEvent('level_completed', { level, distance: distanceKm, score: pinScore, confidence, evidenceUsed: evidenceRevealed, evidenceCount: evidenceRevealed });
      if (!isReplay) {
        await advanceLevel(userId);
      }
      await new Promise((r) => setTimeout(r, 300));
      router.push(`/results/${roundId}`);
    } else {
      setSaveFailed(true);
      savingRef.current = false;
    }
  }, [pinLat, pinLng, evidenceRevealed, confidence, location.lat, location.lng, location.id, level, userId, router, hasCoords, isReplay]);

  if (phase === 'onboarding') {
    return <OnboardingModal onDismiss={() => setPhase('briefing')} />;
  }

  if (phase === 'briefing') {
    return (
      <BriefingPanel
        briefing={location.briefing}
        level={level}
        onBegin={() => setPhase('exploring')}
      />
    );
  }

  if (phase === 'saving') {
    if (saveFailed) {
      return (
        <div className="flex flex-col min-h-dvh bg-black text-white items-center justify-center gap-4 p-4">
          <p className="text-gray-400 text-sm">Something went wrong saving your report.</p>
          <Button variant="primary" onClick={() => router.push('/game')}>
            Try Again
          </Button>
        </div>
      );
    }
    return (
      <div className="flex flex-col min-h-dvh bg-black text-white items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mb-4" />
        <p className="text-gray-400 text-sm">Filing report…</p>
      </div>
    );
  }

  const canSubmit = pinLat !== null && pinLng !== null;

  if (phase === 'exploring') {
    return (
      <div className="relative h-dvh bg-black text-white overflow-hidden">
        {location.provider === 'mapillary' && location.mapillary_id ? (
          <div className="absolute inset-0">
            <StreetView imageId={location.mapillary_id} />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <div className="text-xs text-yellow-400 font-mono uppercase tracking-widest">
            Case #{level} — Locate Cipher
            {isReplay && <span className="ml-2 text-gray-500">(Replay)</span>}
          </div>
          <div className={`text-xs font-mono tabular-nums ${timeUp ? 'text-red-400' : timeLeft <= 60 ? 'text-yellow-400' : 'text-gray-500'}`}>
            {timeUp ? 'EXPIRED' : `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 space-y-3">
          {!timeUp && <EvidencePanel evidence={location.evidence} onReveal={handleReveal} />}
          {timeUp && evidenceRevealed > 0 && (
            <div className="text-xs text-gray-500 text-center py-2">
              Investigation time expired — evidence is sealed.
            </div>
          )}

          <button
            onClick={() => setPhase('pinning')}
            className="w-full py-3 px-6 rounded-lg bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors active:scale-[0.98]"
          >
            Ready to Pin
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'pinning') {
    return (
      <div className="h-dvh bg-black text-white flex flex-col">
        <div className="shrink-0 px-4 pt-4 max-w-lg mx-auto w-full">
          <button
            onClick={() => setPhase('exploring')}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            &larr; Back to Street View
          </button>
        </div>

        <div className="flex-1 min-h-0 px-4 max-w-lg mx-auto w-full">
          <div className="h-full rounded-lg overflow-hidden border border-gray-700">
            <PinMap
              onPinPlaced={(lat, lng) => { setPinLat(lat); setPinLng(lng); }}
              zoom={3}
            />
          </div>
        </div>

        <div className="shrink-0 px-4 pb-4 max-w-lg mx-auto w-full space-y-3">
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
            Submit Report
          </Button>
        </div>
      </div>
    );
  }
}
