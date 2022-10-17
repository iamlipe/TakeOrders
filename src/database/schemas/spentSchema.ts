import { tableSchema } from '@nozbe/watermelondb';

export const spentSchema = tableSchema({
  name: 'spending',
  columns: [{ name: 'userId', type: 'string' }],
});
