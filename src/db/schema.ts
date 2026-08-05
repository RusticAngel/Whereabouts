import { pgTable, uuid, text, jsonb, integer, boolean, date, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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
  cityName: text('city_name'),
  countryName: text('country_name'),
  landmarkName: text('landmark_name'),
  funFact: text('fun_fact'),
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
  xp: integer('xp').default(0),
  level: integer('level').default(1),
  title: text('title').default('Rookie Agent'),
  lastActiveAt: timestamp('last_active_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const badges = pgTable('badges', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  badgeId: text('badge_id').notNull(),
  unlockedAt: timestamp('unlocked_at').defaultNow(),
}, (t) => ({
  unq: uniqueIndex('badges_user_badge').on(t.userId, t.badgeId),
}));

export const friends = pgTable('friends', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  friendUserId: uuid('friend_user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  unq: uniqueIndex('friends_pair').on(t.userId, t.friendUserId),
}));

export const friendRequests = pgTable('friend_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  fromUserId: uuid('from_user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  toUserId: uuid('to_user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  unq: uniqueIndex('friend_requests_unique').on(t.fromUserId, t.toUserId),
  toIdx: index('friend_requests_to_idx').on(t.toUserId),
}));

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

export const locationClues = pgTable('location_clues', {
  id: uuid('id').defaultRandom().primaryKey(),
  imageId: uuid('image_id').notNull().references(() => images.id),
  clues: jsonb('clues').notNull().default('[]'),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  unq: uniqueIndex('location_clues_image').on(t.imageId),
}));

export const profilesRelations = relations(profiles, ({ many }) => ({
  friends: many(friends, { relationName: 'user_friends' }),
  badges: many(badges),
}));
