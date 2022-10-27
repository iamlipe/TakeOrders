import { tableSchema } from '@nozbe/watermelondb';

export const userSchema = tableSchema({
  name: 'users',
  columns: [
    { name: 'userId', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'password', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'phone', type: 'string', isOptional: true },
  ],
});
