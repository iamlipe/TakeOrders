import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class Product extends Model {
  static table = 'products';

  @field('stockId') stockId!: string;

  @field('name') name!: string;

  @field('type') type!: string;

  @field('image') image?: string;

  @field('price') price!: number;

  @field('quantity') quantity!: number;
}
