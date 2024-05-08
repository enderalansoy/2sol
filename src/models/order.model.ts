import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import System from './system.model';

@Table
export default class Order extends Model<Order> {
  @BelongsToMany(() => System, () => SystemOrder)
  declare systems: System[];
}

/**
 * A junction table to form an association between System and Order.
 */
@Table
export class SystemOrder extends Model {
  @ForeignKey(() => Order)
  @Column(DataType.INTEGER)
  declare order_id: number;

  @ForeignKey(() => System)
  @Column(DataType.INTEGER)
  declare system_id: number;

  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 0,
    },
  })
  declare quantity: number;
}
