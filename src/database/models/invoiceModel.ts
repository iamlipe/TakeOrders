import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class Invoice extends Model {
  static table = 'invoicing';

  @field('userId') userId!: string;
}
