import { pgTable, uuid, text, jsonb, integer, boolean, date, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const images = pgTable('images', {
  id: uuid('id').defaultRandom().primaryKey(),
  imageUrl: text('image_url'),
  lat: text('lat'),
  lng: text('lng'),
  steps: jsonb('steps'),
  clues: jsonb('clues'),
  briefing: text('briefing'),
  evidence: jsonb('evidence').notNull().default('[]'),
  levelOrder: integer('level_order').default(1),
  provider: text('provider').notNull().default('unsplash'),
  mapillaryId: text('mapillary_id'),
  isPano: boolean('is_pano').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const rounds = pgTable('rounds', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  imageId: uuid('image_id').notNull().references(() => images.id),
  level: integer('level').default(1),
  totalScore: integer('total_score').notNull().default(0),
  pinGuessLat: text('pin_guess_lat'),
  pinGuessLng: text('pin_guess_lng'),
  pinScore: integer('pin_score'),
  evidenceRevealed: integer('evidence_revealed').default(0),
  confidence: text('confidence').default('low'),
  distanceKm: integer('distance_km'),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const dailyScores = pgTable('daily_scores', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  date: date('date').notNull().defaultNow(),
  totalScore: integer('total_score').notNull(),
  timeSeconds: integer('time_seconds'),
  distanceKm: integer('distance_km'),
}, (t) => ({
  unq: uniqueIndex('daily_scores_user_date').on(t.userId, t.date),
}));

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  username: text('username').unique(),
  avatarUrl: text('avatar_url'),
  currentLevel: integer('current_level').default(1),
  dailyStreak: integer('daily_streak').default(0),
  lastDailyDate: date('last_daily_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const challenges = pgTable('challenges', {
  id: uuid('id').defaultRandom().primaryKey(),
  seed: text('seed').notNull().unique(),
  imageId: uuid('image_id').notNull().references(() => images.id),
  createdBy: uuid('created_by').notNull().references(() => profiles.id),
  rematchOf: uuid('rematch_of'),
  playsCount: integer('plays_count').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const challengeResults = pgTable('challenge_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  challengeId: uuid('challenge_id').notNull().references(() => challenges.id),
  userId: uuid('user_id').notNull().references(() => profiles.id),
  score: integer('score').notNull(),
  distanceKm: integer('distance_km').notNull(),
  timeSeconds: integer('time_seconds'),
  evidenceRevealed: integer('evidence_revealed').notNull().default(0),
  confidence: text('confidence').notNull().default('low'),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  unq: uniqueIndex('challenge_results_player').on(t.challengeId, t.userId),
}));
