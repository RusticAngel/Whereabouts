export const flags = {
  DIFFICULTY_MODES: process.env.NEXT_PUBLIC_FLAG_DIFFICULTY === 'true',
  DUELS: process.env.NEXT_PUBLIC_FLAG_DUELS === 'true',
  EXPLORER: process.env.NEXT_PUBLIC_FLAG_EXPLORER === 'true',
  BATTLE_ROYALE: false,
  CUSTOM_MAPS: false,
} as const;

export type FlagKey = keyof typeof flags;

export function isFlagEnabled(key: FlagKey): boolean {
  return flags[key];
}