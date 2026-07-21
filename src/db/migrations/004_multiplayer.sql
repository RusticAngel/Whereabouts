-- Multiplayer "Play with Friends" schema

-- Challenges table: stores shareable challenge references
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seed text NOT NULL UNIQUE,
  image_id uuid NOT NULL REFERENCES images(id),
  created_by uuid NOT NULL REFERENCES profiles(id),
  created_at timestamp DEFAULT now()
);

-- Challenge results: each player's result for a challenge
CREATE TABLE IF NOT EXISTS challenge_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES challenges(id),
  user_id uuid NOT NULL REFERENCES profiles(id),
  score integer NOT NULL,
  distance_km integer NOT NULL,
  time_seconds integer,
  evidence_revealed integer DEFAULT 0,
  confidence text DEFAULT 'low',
  created_at timestamp DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

-- Daily scores enhancements: time + distance tracking
ALTER TABLE daily_scores ADD COLUMN IF NOT EXISTS time_seconds integer;
ALTER TABLE daily_scores ADD COLUMN IF NOT EXISTS distance_km integer;

-- Streak system
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_streak integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_daily_date date;
