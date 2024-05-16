import { Request, Response } from 'express';
import { Transaction } from 'sequelize';
import { dbConnection } from '../database';
import Order, { SystemOrder } from '../models/order.model';
import Product, { SystemProduct } from '../models/product.model';
import System from '../models/system.model';

export interface OrderItem {
  system_id: number;
  quantity: number;
}

/**
 * List all orders with their associated systems.
 * @param {Request} req - The Express request object (unused).
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} A promise that resolves with a response containing the list of orders.
 */
export const list = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const orders = await Order.findAll({ include: [System] });
    return res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Create a new order with associated systems and update product stock.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} - A promise that resolves to a response object with the created order.
 */
export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    return await dbConnection.transaction(async (transaction: Transaction) => {
      const items: OrderItem[] = req.body.items;
      await validateInput(items, transaction);
      const systemIds = [...new Set(items.map((item) => item.system_id))];

      const systems = await SystemProduct.findAll({
        where: {
          system_id: systemIds,
        },
        transaction,
      });

      await Promise.all(
        systems.map(async (product: SystemProduct) => {
          const systemQuantity =
            items.find((item) => item.system_id === product.system_id)
              ?.quantity || 0;
          await Product.decrement('stock', {
            by: product.quantity * systemQuantity,
            where: { id: product.product_id },
            transaction,
          });
        })
      );

      const order = await Order.create({ ...req.body }, { transaction });

      await SystemOrder.bulkCreate(
        items.map((item) => ({
          order_id: order.id,
          system_id: item.system_id,
          quantity: item.quantity,
        })),
        { transaction }
      );

      return res.status(201).json(order);
    });
  } catch (error) {
    console.error('Error placing order:', error);
    if (res.headersSent) {
      console.error('Response headers already sent.');
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.status(400).json({ error: (error as Error).message });
  }
};

/**
 * Validate the input items for creating an order.
 * @param {OrderItem[]} items - The order items to validate.
 * @param {Transaction} t - The transaction object.
 * @returns {Promise<void>} - A promise that resolves when the input is validated or rejects with an error message.
 * @throws {Error} If validation fails.
 */
export const validateInput = async (
  items: OrderItem[],
  t: Transaction,
): Promise<void> => {
  for (const item of items) {
    const system = await System.findByPk(item.system_id);
    if (!system) {
      throw new Error(`System not found for system ID ${item.system_id}.`);
    }
    const systemProduct = await SystemProduct.findOne({
      where: { system_id: item.system_id },
      transaction: t,
    });
    if (!systemProduct) {
      throw new Error(
        `System product not found for system ID ${item.system_id}.`
      );
    }
    const product = await Product.findByPk(systemProduct.product_id, {
      transaction: t,
    });
    if (!product) {
      throw new Error(
        `Product not found for system product with ID ${systemProduct.id}.`
      );
    }
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product with ID ${product.id}.`);
    }
  }
};
