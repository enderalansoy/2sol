import { Request, Response } from 'express';
import { LOW_STOCK_THRESHOLD, STOCK_DEFAULTS } from '../constants';
import Product from '../models/product.model';
import { sendEmail } from '../services/email.service';

/**
 * Fetches a list of all products.
 *
 * @param {Request} req - The Express request object (unused).
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} A promise that resolves with a response containing the list of products.
 */
export const list = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const products = await Product.findAll();
    return res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Creates a new product.
 *
 * @param {Request} req - The Express request object containing product data.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} A promise that resolves with a response containing the created product.
 */
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

/**
 * Checks for products that have gone below the low stock threshold since the previous check.
 *
 * @param {ProductDocument[]} previousProducts - An array of product objects from a previous stock check.
 * @returns {Promise<void>} (nothing is returned)
 */
export const checkLowStock = async (previousProducts: Product[]): Promise<void> => {
  const products = await Product.findAll();

  previousProducts.forEach((previousProduct) => {
    const current = products.find((product) => product.id === previousProduct.id);
    if (
      previousProduct.stock >= LOW_STOCK_THRESHOLD * STOCK_DEFAULTS[previousProduct.id] &&
      (current?.stock || 0) < LOW_STOCK_THRESHOLD * STOCK_DEFAULTS[previousProduct.id]
    ) {
      sendLowStockNotification(previousProduct);
    }
  });
};

/**
 * Sends a notification (currently logged to the console and email) for a product that has gone below the low stock threshold.
 *
 * @param {Product} product - The product object with low stock.
 * @returns {void} (nothing is returned)
 */
export const sendLowStockNotification = (product: Product) => {
  const message = `The stock for ${product.name} has gone under ${LOW_STOCK_THRESHOLD * 100}%!`;

  console.info(message);
  sendEmail('Low stock alert', message);
};
