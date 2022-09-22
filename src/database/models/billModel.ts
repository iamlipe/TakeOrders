import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

export class Bill extends Model {
  static table = 'bills';

  @field('name') name!: string;

  @field('email') email?: string;

  @field('phone') phone?: string;

  @field('status') status!: boolean;

  @field('invoiceId') invoiceId!: string;

  @field('userId') userId!: string;
}
