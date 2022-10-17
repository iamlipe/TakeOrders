import { tableSchema } from '@nozbe/watermelondb';

export const billSchema = tableSchema({
  name: 'bills',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'email', type: 'string', isOptional: true },
    { name: 'phone', type: 'string', isOptional: true },
    { name: 'status', type: 'boolean' },
    { name: 'invoiceId', type: 'string' },
    { name: 'userId', type: 'string' },
  ],
});
