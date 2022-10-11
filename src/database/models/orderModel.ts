import { Model } from '@nozbe/watermelondb';
import { field, relation, date } from '@nozbe/watermelondb/decorators';
import { Bill } from './billModel';
import { Product } from './productModel';

export class Order extends Model {
  static table = 'orders';

  @field('productId') productId!: string;

  @field('billId') billId!: string;

  @field('quantity') quantity!: number;

  @relation('bills', 'billId') bill!: Bill;

  @relation('products', 'productId') product!: Product;

  @date('createAt') createAt!: number;

  @date('updateAt') updateAt!: number;
}
