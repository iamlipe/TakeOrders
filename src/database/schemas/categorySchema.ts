import { tableSchema } from '@nozbe/watermelondb';

export const categorySchema = tableSchema({
  name: 'categories',
  columns: [
    { name: 'categoryId', type: 'string' },
    { name: 'name', type: 'string' },
  ],
});
