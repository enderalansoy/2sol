import { Router } from 'express';
import { create, list } from '../controllers/product.controller';

const router = Router();

/**
 * GET /product
 * Retrieves a list of products.
 */
router.get('/', list);

/**
 * POST /product/create
 * Creates a new product.
 */
router.post('/create', create);

export default router;
