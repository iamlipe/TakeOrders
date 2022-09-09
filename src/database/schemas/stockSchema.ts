import { tableSchema } from '@nozbe/watermelondb';

export const stockSchema = tableSchema({
  name: 'stock',
  columns: [{ name: 'userId', type: 'string' }],
});
