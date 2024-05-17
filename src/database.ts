import { Request, Response } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { SEED_DATA_PRODUCT, SEED_DATA_SYSTEM } from './constants';
import Order, { SystemOrder } from './models/order.model';
import Product, { SystemProduct } from './models/product.model';
import System from './models/system.model';

export const dbConnection = new Sequelize({
  dialect: 'sqlite',
  host: './db/data.sqlite',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'sequelize',
  logging: false,
  models: [Order, SystemOrder, Product, System, SystemProduct],
});

/**
 * Seeds the database with initial data.
 * @param {Request} _req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} - A promise that resolves to a response object indicating the result of the seeding operation.
 */
export const seedData = async (_req: Request, res: Response) => {
  await Product.bulkCreate([...SEED_DATA_PRODUCT] as Product[]);
  const system = await System.create();
  const products = [...SEED_DATA_SYSTEM].map((item) => ({
    ...item,
    system_id: system.id,
  }));

  await SystemProduct.bulkCreate(products as SystemProduct[]);

  return res.json('Data created');
};
