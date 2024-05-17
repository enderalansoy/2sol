import {
  BeforeBulkUpdate,
  BeforeUpdate,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';

import System from './system.model';

@Table
export default class Product extends Model<Product> {
  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 0,
    },
  })
  declare stock: number;

  @BelongsToMany(() => System, () => SystemProduct)
  declare systems: System[];

  @BeforeBulkUpdate
  @BeforeUpdate
  static stockAlert(instance: Product) {
    if (instance.stock < 0) throw new Error('Stock cannot be lower than 0.');
  }
}

/**
 * A junction table to form an association between System and Product.
 *
 * While it is not an absolute necessity, it is a nicer way to
 * keep track of this relationship.
 */
@Table
export class SystemProduct extends Model<SystemProduct> {
  @ForeignKey(() => Product)
  @Column(DataType.INTEGER)
  declare product_id: number;

  @ForeignKey(() => System)
  @Column(DataType.INTEGER)
  declare system_id: number;

  @BelongsTo(() => Product)
  declare product: Product;

  @BelongsTo(() => System)
  declare system: System;

  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 0,
    },
  })
  declare quantity: number;
}
