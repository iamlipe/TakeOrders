import { tableSchema } from '@nozbe/watermelondb';

export const clientSchema = tableSchema({
  name: 'clients',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'userId', type: 'string' },
    { name: 'email', type: 'string', isOptional: true },
    { name: 'phone', type: 'string', isOptional: true },
  ],
});
