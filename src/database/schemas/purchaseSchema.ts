import { tableSchema } from '@nozbe/watermelondb';

export const purchaseSchema = tableSchema({
  name: 'purchases',
  columns: [
    { name: 'spentId', type: 'string' },
    { name: 'productId', type: 'string', isOptional: true },
    { name: 'expanse', type: 'string', isOptional: true },
    { name: 'description', type: 'string', isOptional: true },
    { name: 'totalPrice', type: 'number' },
    { name: 'createdAt', type: 'number' },
    { name: 'updatedAt', type: 'number' },
  ],
});
