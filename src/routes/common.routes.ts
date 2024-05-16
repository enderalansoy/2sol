import { Router } from 'express';
import { seedData } from '../database';

const router = Router();

/**
 * POST /seed
 * Seeds the database with initial data.
 */
router.post('/seed', seedData);

/**
 * GET /
 * Returns a simple greeting message.
 */
router.get('/', (_req, res) => {
  return res.json('Hello');
});

export default router;
