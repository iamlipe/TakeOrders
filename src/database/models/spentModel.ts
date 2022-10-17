import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class Spent extends Model {
  static table = 'spending';

  @field('userId') userId!: string;
}
