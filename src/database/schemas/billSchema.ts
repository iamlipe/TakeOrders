import { tableSchema } from '@nozbe/watermelondb';

export const billSchema = tableSchema({
  name: 'bills',
  columns: [
    { name: 'status', type: 'boolean' },
    { name: 'invoiceId', type: 'string' },
    { name: 'clientId', type: 'string' },
  ],
});
