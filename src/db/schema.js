import { pgTable, pgEnum, serial, text, timestamp, integer, json } from 'drizzle-orm/pg-core';

// Enum for match status (database type: match_status)
export const matchStatus = pgEnum('match_status', ['scheduled', 'live', 'finished']);

// Matches table
export const matches = pgTable('matches', {
	id: serial('id').primaryKey(),
	sport: text('sport').notNull(),
	homeTeam: text('home_team').notNull(),
	awayTeam: text('away_team').notNull(),
	status: matchStatus('status').notNull(),
	startTime: timestamp('start_time').notNull(),
	endTime: timestamp('end_time'),
	homeScore: integer('home_score').default(0).notNull(),
	awayScore: integer('away_score').default(0).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Commentary table for real-time events
export const commentary = pgTable('commentary', {
	id: serial('id').primaryKey(),
	matchId: integer('match_id')
  .references(() => matches.id)
  .notNull(),
	minute: integer('minute'),
	sequence: integer('sequence').notNull(),
	period: text('period'),
	eventType: text('event_type'),
	actor: text('actor'),
	team: text('team'),
	message: text('message').notNull(),
	metadata: json('metadata'),
	tags: json('tags'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

