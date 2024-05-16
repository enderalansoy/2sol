import { Router } from 'express';
import { create, list } from '../controllers/system.controller';

const router = Router();

/**
 * GET /system
 * Retrieves a list of systems.
 */
router.get('/', list);

/**
 * POST /system/create
 * Creates a new system.
 */
router.post('/create', create);

export default router;
