type EventName =
  | 'game_started'
  | 'pin_placed'
  | 'evidence_revealed'
  | 'hint_used'
  | 'report_submitted'
  | 'level_completed';

interface EventPayload {
  level?: number;
  distance?: number;
  score?: number;
  confidence?: string;
  evidenceUsed?: number;
  evidenceCount?: number;
  hintsUsed?: number;
}

export function trackEvent(name: EventName, payload: EventPayload = {}) {
  console.log(`[Trace] ${name}`, JSON.stringify(payload));
}
