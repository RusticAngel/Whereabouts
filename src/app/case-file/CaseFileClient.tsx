'use client';

import { CaseFileEntry } from '@/types';
import { CaseFile } from '@/components/results/CaseFile';

interface CaseFileClientProps {
  entries: CaseFileEntry[];
  currentLevel: number;
}

export function CaseFileClient({ entries, currentLevel }: CaseFileClientProps) {
  return <CaseFile entries={entries} currentLevel={currentLevel} />;
}
