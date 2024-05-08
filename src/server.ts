import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import SystemRoutes from './routes/system.routes';
import ProductRoutes from './routes/product.routes';
import OrderRoutes from './routes/order.routes';
import CommonRoutes from './routes/common.routes';

const createServer = () => {
  const app: Express = express();
  const env = process.env.ENV || 'dev';

  // Plugins
  app.use(cors());
  app.use(helmet());
  app.use(morgan(env));
  app.use(express.json());

  // Routes
  app.use('/system', SystemRoutes);
  app.use('/product', ProductRoutes);
  app.use('/order', OrderRoutes);
  app.use('/', CommonRoutes);

  return app;
};

export default createServer;
