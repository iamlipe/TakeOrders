import { combineReducers } from '@reduxjs/toolkit';

import user, { userState } from './userSlice';
import client, { clientState } from './clientSlice';
import invoice, { invoiceState } from './invoiceSlice';
import spent, { spentState } from './spentSlice';
import stock, { stockState } from './stockSlice';
import product, { productState } from './productSlice';
import purchase, { purchaseState } from './purchaseSlice';
import bill, { billState } from './billSlice';
import order, { orderState } from './orderSlice';
import sale, { saleState } from './saleSlice';
import profit, { profitState } from './profitSlice';

export const globalState = {
  user: userState,
  client: clientState,
  invoice: invoiceState,
  spent: spentState,
  stock: stockState,
  product: productState,
  purchase: purchaseState,
  bill: billState,
  order: orderState,
  sale: saleState,
  profit: profitState,
};

export const globalReducer = {
  user,
  invoice,
  spent,
  stock,
  client,
  product,
  purchase,
  bill,
  order,
  sale,
  profit,
};

const rootReducer = combineReducers(globalReducer);

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
