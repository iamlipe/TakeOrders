import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class Client extends Model {
  static table = 'clients';

  @field('name') name!: string;

  @field('userId') userId!: string;

  @field('email') email?: string;

  @field('phone') phone?: string;
}
