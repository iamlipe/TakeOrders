import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class Stock extends Model {
  static table = 'stock';

  @field('userId') userId!: string;
}
