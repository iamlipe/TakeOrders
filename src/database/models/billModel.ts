import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';
import { Client } from './clientModal';

export class Bill extends Model {
  static table = 'bills';

  @field('status') status!: boolean;

  @field('clientId') clientId!: string;

  @field('invoiceId') invoiceId!: string;

  @relation('clients', 'clientId') client!: Client;
}
