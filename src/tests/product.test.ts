import supertest from 'supertest';
import createServer from '../server';
import Product from '../models/product.model';

const app = createServer();

describe('product', () => {
  describe('create one product', () => {
    it('should return the created product', async () => {
      const input = {
        name: 'Product Name',
        stock: 23,
      };
      const createProductControllerMock = jest
        .spyOn(Product, 'create')
        .mockReturnValueOnce(input);
      const { statusCode, body } = await supertest(app)
        .post('/product/create')
        .send(input);

      expect(statusCode).toBe(201);

      expect(body).toEqual(input);

      expect(createProductControllerMock).toHaveBeenCalledWith(input);
    });
  });
});
