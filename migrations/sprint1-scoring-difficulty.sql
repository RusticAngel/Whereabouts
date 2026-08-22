-- ============================================
-- SPRINT 1 MIGRATION: Scoring Overhaul + Difficulty Modes + Explorer Fields
-- ============================================
-- Run this against your Neon database
-- Generated: 2026-08-22

-- ============================================
-- 1. Rounds: store difficulty + map diagonal for scoring replay
-- ============================================
ALTER TABLE rounds
  ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'move',
  ADD COLUMN IF NOT EXISTS map_diagonal_km DOUBLE PRECISION;

-- ============================================
-- 2. Images: Explorer Mode + Difficulty support + Map diagonal
-- ============================================
ALTER TABLE images
  ADD COLUMN IF NOT EXISTS country_code TEXT,
  ADD COLUMN IF NOT EXISTS region_code TEXT,
  ADD COLUMN IF NOT EXISTS sequence_id TEXT,
  ADD COLUMN IF NOT EXISTS difficulty_modes TEXT[] DEFAULT '{"move","no-move","nmpz"}',
  ADD COLUMN IF NOT EXISTS map_diagonal_km DOUBLE PRECISION;

-- ============================================
-- 3. Indexes for Explorer Mode queries
-- ============================================
CREATE INDEX IF NOT EXISTS idx_images_country_code ON images(country_code);
CREATE INDEX IF NOT EXISTS idx_images_region_code ON images(region_code);
CREATE INDEX IF NOT EXISTS idx_images_level_order ON images(level_order);

-- ============================================
-- 4. Optional: Add comment for documentation
-- ============================================
COMMENT ON COLUMN rounds.difficulty IS 'Difficulty mode: move (1.0x), no-move (1.2x), nmpz (1.5x)';
COMMENT ON COLUMN rounds.map_diagonal_km IS 'Map diagonal in km used for GeoGuessr exponential scoring';
COMMENT ON COLUMN images.country_code IS 'ISO 3166-1 alpha-2 country code for Explorer Mode';
COMMENT ON COLUMN images.region_code IS 'Region code (e.g., EU-WEST, ASIA-SE) for Explorer Mode';
COMMENT ON COLUMN images.sequence_id IS 'Mapillary sequence ID for Move mode navigation';
COMMENT ON COLUMN images.difficulty_modes IS 'Array of supported difficulty modes for this location';
COMMENT ON COLUMN images.map_diagonal_km IS 'Map diagonal in km for GeoGuessr scoring';