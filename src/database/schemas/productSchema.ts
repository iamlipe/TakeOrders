import { tableSchema } from '@nozbe/watermelondb';

export const productSchema = tableSchema({
  name: 'products',
  columns: [
    { name: 'stockId', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'categoryId', type: 'string' },
    { name: 'image', type: 'string' },
    { name: 'price', type: 'number' },
    { name: 'quantitySold', type: 'number' },
  ],
});
