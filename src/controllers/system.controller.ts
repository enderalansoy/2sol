import { Request, Response } from 'express';
import Product, { SystemProduct } from '../models/product.model';
import System from '../models/system.model';

export const list = async (req: Request, res: Response): Promise<Response> => {
  try {
    const systems = await System.findAll({
      include: [
        {
          model: Product,
          through: { attributes: ['quantity'] },
          attributes: ['id', 'name'],
        },
      ],
    });

    const transformedSystems = systems.map((system: System) => ({
      id: system.id,
      createdAt: system.createdAt,
      updatedAt: system.updatedAt,
      products: system.products.map(
        (product: Product & { SystemProduct?: { quantity: number } }) => ({
          id: product.id,
          name: product.name,
          quantity: product.SystemProduct?.quantity,
        })
      ),
    }));

    return res.status(200).json(transformedSystems);
  } catch (error) {
    console.error('Error fetching systems:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const system = await System.create();
    const products = [...req.body].map((item) => ({
      ...item,
      system_id: system.id,
    }));

    const result = await SystemProduct.bulkCreate(products);

    return res.status(201).json(result);
  } catch (error) {
    console.error('Error creating system:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
