import Product from './models/product.model';

export const LOW_STOCK_THRESHOLD = 0.2; // 20%

export const STOCK_DEFAULTS = [1200, 600, 500];

export const SEED_DATA_PRODUCT = [
  {
    name: 'Solar panel',
    stock: STOCK_DEFAULTS[0],
  },
  {
    name: 'Inverter',
    stock: STOCK_DEFAULTS[1],
  },
  {
    name: 'Optimizer',
    stock: STOCK_DEFAULTS[2],
  },
];

export const SEED_DATA_SYSTEM = [
  {
    product_id: 1,
    quantity: 12,
  },
  {
    product_id: 2,
    quantity: 6,
  },
  {
    product_id: 3,
    quantity: 6,
  },
];
