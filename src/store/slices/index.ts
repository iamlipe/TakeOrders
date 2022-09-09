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
};

const rootReducer = combineReducers(globalReducer);

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
