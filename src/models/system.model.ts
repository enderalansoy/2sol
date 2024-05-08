import { BelongsToMany, Model, Table } from 'sequelize-typescript';

import Order, { SystemOrder } from './order.model';
import Product, { SystemProduct } from './product.model';

@Table
export default class System extends Model<System> {
  @BelongsToMany(() => Product, () => SystemProduct)
  declare products: Product[];

  @BelongsToMany(() => Order, () => SystemOrder)
  declare orders: Order[];
}
