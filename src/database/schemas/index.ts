import { appSchema } from '@nozbe/watermelondb';

import { billSchema } from './billSchema';
import { clientSchema } from './clientSchema';
import { invoiceSchema } from './invoiceSchema';
import { orderSchema } from './orderSchema';
import { productSchema } from './productSchema';
import { purchaseSchema } from './purchaseSchema';
import { spentSchema } from './spentSchema';
import { stockSchema } from './stockSchema';
import { userSchema } from './userSchema';
import { salesSchema } from './SalesSchema';

export const schemas = appSchema({
  version: 1,
  tables: [
    userSchema,
    clientSchema,
    stockSchema,
    invoiceSchema,
    spentSchema,
    productSchema,
    purchaseSchema,
    billSchema,
    orderSchema,
    salesSchema,
  ],
});
