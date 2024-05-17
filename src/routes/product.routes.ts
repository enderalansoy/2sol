import { Router } from 'express';
import { create, findById, list } from '../controllers/product.controller';
import Product from '../models/product.model';

const router = Router();

/**
 * GET /product
 * Retrieves a list of products.
 */
router.get('/', list);

/**
 * GET /product
 * Retrieves one product by id.
 */
router.get('/:id', findById);

/**
 * POST /product/create
 * Creates a new product.
 */
router.post('/create', create);

export default router;
