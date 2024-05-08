import { Router } from 'express';
import { create, list } from '../controllers/order.controller';
import { checkLowStock } from '../controllers/product.controller';
import Product from '../models/product.model';

const router = Router();

router.get('/', list);
router.post('/create', async (req, res) => {
  const currentProducts = await Product.findAll();
  create(req, res).then(() => {
    checkLowStock(currentProducts);
  });
});

export default router;
