import { EvidenceItem } from '@/types';

export const EVIDENCE_COSTS = [200, 400, 600];
export const MAX_EVIDENCE = 3;

export function evidenceCost(count: number): number {
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += EVIDENCE_COSTS[Math.min(i, EVIDENCE_COSTS.length - 1)];
  }
  return total;
}

export function revealEvidence(
  evidence: EvidenceItem[],
  revealedCount: number,
): EvidenceItem | null {
  if (revealedCount >= evidence.length || revealedCount >= MAX_EVIDENCE) {
    return null;
  }
  return evidence[revealedCount] ?? null;
}

export function getRevealedEvidence(
  evidence: EvidenceItem[],
  revealedCount: number,
): EvidenceItem[] {
  return evidence.slice(0, Math.min(revealedCount, MAX_EVIDENCE));
}
