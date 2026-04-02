import { Router } from 'express';
import { createMatchSchema, listMatchesQuerySchema } from '../validation/matches.js';
import {matches} from '../db/schema.js';
import { db } from '../db/db.js';
import { getMatchStatus } from '../utils/match-status.js';
import { desc } from 'drizzle-orm';

export const matchesRouter = Router();

 // defining a constant for the maximum limit of matches that can be returned in a single request, to prevent potential performance issues with large datasets
const MAX_LIMIT = 100;

 // GET /matches - List matches (pagination can be added later)
matchesRouter.get('/', async (req, res) => {
  const parsed = listMatchesQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid query parameters', details: JSON.stringify(parsed.error) });
  }

  // Creating a limit we want to get back in a single request, defaulting to 50 if not provided
  const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);

  // Try and Catch block to handle any potential errors that may occur during the database query, ensuring that the server responds with an appropriate error message and status code if something goes wrong
  try {
    const data = await db 
      .select()
      .from(matches)
      .limit(limit)
      .orderBy(desc(matches.createdAt)) // The new matches will appear at the top
    res.json({ data }); // returing the data to the front end in a JSON format, allowing the client to easily consume and display the list of matches
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch matches', details: JSON.stringify(e) });
  }


});

matchesRouter.post('/', async (req, res) => {
 const parsed = createMatchSchema.safeParse(req.body);
 const {data: {startTime, endTime, homeScore, awayScore}} = parsed;


 if (!parsed.success) {
  return res.status(400).json({ error: 'Invalid match data', details: JSON.stringify(parsed.error.errors) });
 }

 try {
  const [event] = await db.insert(matches).values({
    ...parsed.data,
       startTime: new Date(startTime),
       endTime: new Date(endTime),
       homeScore: homeScore ?? 0,
       awayScore: awayScore ?? 0,
       status: getMatchStatus(startTime, endTime) // this is from the utils 
  }).returning();
  res.status(201).json({data: event, message: 'Match created successfully' });
 } catch (e) {
  res.status(500).json({ error: 'Failed to create match', details: JSON.stringify(e) });
 }

});