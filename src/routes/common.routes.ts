import { Router } from 'express';
import { seedData } from '../database';

const router = Router();

router.post('/seed', seedData);
router.get('/', (_req, res) => {
  return res.json('Hello');
});

export default router;
