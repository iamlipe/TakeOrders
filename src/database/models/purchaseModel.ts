import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';
import { Product } from './productModel';

export class Purchase extends Model {
  static table = 'purchases';

  @field('spentId') spentId!: string;

  @field('productId') productId?: string;

  @field('expanse') expanse?: string;

  @field('description') description?: string;

  @field('totalPrice') totalPrice!: number;

  @relation('products', 'productId') product!: Product;
}
