import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class Sales extends Model {
  static table = 'sales';

  @field('userId') userId!: string;

  @field('name') name!: string;

  @field('totalPrice') totalPrice!: number;

  @field('createdAt') createdAt!: number;

  @field('updatedAt') updatedAt!: number;
}
