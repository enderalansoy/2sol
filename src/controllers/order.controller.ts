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

export const list = async (req: Request, res: Response): Promise<Response> => {
  try {
    const orders = await Order.findAll({ include: [System] });
    return res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    return await dbConnection.transaction(async (transaction) => {
      const items: OrderItem[] = req.body.items;
      await validateInput(items, transaction, res);
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

/*
 * A series of basic checks to make sure the user input is valid
 */
const validateInput = async (
  items: OrderItem[],
  t: Transaction,
  res: Response
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
