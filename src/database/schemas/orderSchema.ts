import { tableSchema } from '@nozbe/watermelondb';

export const orderSchema = tableSchema({
  name: 'orders',
  columns: [
    { name: 'billId', type: 'string' },
    { name: 'productId', type: 'string' },
    { name: 'quantity', type: 'number' },
    { name: 'createAt', type: 'number' },
    { name: 'updateAt', type: 'number' },
  ],
});
