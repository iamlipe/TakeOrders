import { tableSchema } from '@nozbe/watermelondb';

export const salesSchema = tableSchema({
  name: 'sales',
  columns: [
    { name: 'userId', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'totalPrice', type: 'number' },
    { name: 'createdAt', type: 'number' },
    { name: 'updatedAt', type: 'number' },
  ],
});
