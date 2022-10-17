import { tableSchema } from '@nozbe/watermelondb';

export const invoiceSchema = tableSchema({
  name: 'invoicing',
  columns: [{ name: 'userId', type: 'string' }],
});
