import supertest from 'supertest';
import createServer from '../server';
import Product, { SystemProduct } from '../models/product.model';
import Order from '../models/order.model';

const app = createServer();

jest.mock('../models/product.model', () => ({
  findByPk: jest.fn(),
  SystemProduct: {
    findAll: jest.fn(),
  },
}));

jest.mock('../models/order.model', () => ({
  create: jest.fn(),
}));

describe('order', () => {
  describe('updates product stock correctly', () => {
    it('should decrease product stock after order creation', async () => {
      const mockProduct = { id: 1, name: 'Mock product', stock: 100 };
      const mockSystemProduct = { system_id: 1, product_id: 1, quantity: 12 };

      Product.findByPk = jest.fn().mockResolvedValue(mockProduct);
      SystemProduct.findAll = jest.fn().mockResolvedValue([mockSystemProduct]);
      Order.create = jest.fn().mockResolvedValue({ id: 1 });

      const orderInput = { items: [{ system_id: 1, quantity: 2 }] };

      const { statusCode: createOrderStatusCode } = await supertest(app)
        .post('/order/create')
        .send(orderInput);

      const { body: productBody } = await supertest(app).get('/product/1');

      expect(createOrderStatusCode).toBe(201);
      expect(productBody.stock).toEqual(76);
    });
  });
});
