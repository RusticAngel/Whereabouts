import { pgTable, uuid, text, jsonb, integer, boolean, date, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const images = pgTable('images', {
  id: uuid('id').defaultRandom().primaryKey(),
  imageUrl: text('image_url').notNull(),
  steps: jsonb('steps').notNull(),
  clues: jsonb('clues').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const rounds = pgTable('rounds', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  imageId: uuid('image_id').notNull().references(() => images.id),
  stepReached: integer('step_reached').notNull(),
  totalScore: integer('total_score').notNull().default(0),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const dailyScores = pgTable('daily_scores', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  date: date('date').notNull().defaultNow(),
  totalScore: integer('total_score').notNull(),
}, (t) => ({
  unq: uniqueIndex('daily_scores_user_date').on(t.userId, t.date),
}));

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  username: text('username').unique(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
});
