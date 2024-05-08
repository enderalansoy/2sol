import { Router } from 'express';
import { create, list } from '../controllers/product.controller';

const router = Router();

router.get('/', list);
router.post('/create', create);

export default router;
