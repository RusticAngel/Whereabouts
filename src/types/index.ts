export type EvidenceType =
  | 'continent'
  | 'driving_side'
  | 'language'
  | 'road_line_color'
  | 'climate'
  | 'area_type'
  | 'license_plate_style'
  | 'architecture'
  | 'terrain'
  | 'signage_style';

export interface EvidenceItem {
  type: EvidenceType;
  value: string;
  label: string;
}

export type Confidence = 'low' | 'medium' | 'high';

export interface LocationData {
  id: string;
  image_url: string | null;
  lat?: string | null;
  lng?: string | null;
  briefing: string;
  evidence: EvidenceItem[];
  level_order: number;
  provider: string;
  mapillary_id?: string | null;
  isPlaceholder?: boolean;
}

export interface CaseFileEntry {
  level: number;
  bestScore: number;
  completed: boolean;
}

export interface RoundSaveData {
  pinGuessLat: string;
  pinGuessLng: string;
  distanceKm: number;
  pinScore: number;
  evidenceRevealed: number;
  confidence: string;
  totalScore: number;
}
