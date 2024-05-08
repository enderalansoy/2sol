import { Request, Response } from 'express';
import { LOW_STOCK_THRESHOLD, STOCK_DEFAULTS } from '../constants';
import Product from '../models/product.model';
import { sendEmail } from '../services/email.service';

export const list = async (req: Request, res: Response): Promise<Response> => {
  try {
    const products = await Product.findAll();
    return res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const product = await Product.create({ ...req.body });

    return res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const checkLowStock = async (previousProducts: Product[]) => {
  const products = await Product.findAll();

  previousProducts.forEach((previousProduct) => {
    const current = products.find(
      (product) => product.id === previousProduct.id
    );
    if (
      previousProduct.stock >=
        LOW_STOCK_THRESHOLD * STOCK_DEFAULTS[previousProduct.id] &&
      (current?.stock || 0) <
        LOW_STOCK_THRESHOLD * STOCK_DEFAULTS[previousProduct.id]
    ) {
      sendLowStockNotification(previousProduct);
    }
  });
};

const sendLowStockNotification = (product: Product) => {
  const message = `The stock for ${product.name}
    has gone under ${LOW_STOCK_THRESHOLD * 100}%!`;

  console.info(message);
  sendEmail('Low stock alert', message);
};
