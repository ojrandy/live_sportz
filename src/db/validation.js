import { z } from 'zod';

export const matchStatusEnum = ['scheduled', 'live', 'finished'];

export const matchSchema = z.object({
  sport: z.string().min(1),
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  status: z.enum(matchStatusEnum),
  startTime: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
    return arg;
  }, z.date()),
  endTime: z.optional(z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
    return arg;
  }, z.date())),
  homeScore: z.number().int().nonnegative().optional().default(0),
  awayScore: z.number().int().nonnegative().optional().default(0),
});

export const commentarySchema = z.object({
  matchId: z.number().int().positive(),
  minute: z.number().int().nonnegative().optional(),
  sequence: z.number().int().nonnegative(),
  period: z.string().optional(),
  eventType: z.string().optional(),
  actor: z.string().optional(),
  team: z.string().optional(),
  message: z.string().min(1),
  metadata: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
});

export function validateMatch(payload) {
  return matchSchema.parse(payload);
}

export function validateCommentary(payload) {
  return commentarySchema.parse(payload);
}
