import { Bill as BillModel } from '@database/models/billModel';
import { Order as OrderModel } from '@database/models/orderModel';
import { Product as ProductModel } from '@database/models/productModel';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GetOrder {
  billId: string;
}

export interface NewOrder {
  quantity: number;
  productId: string;
  billId: string;
}

export interface RemovedOrder {
  order: OrderModel;
}

export interface UpdatedOrder extends RemovedOrder {
  updatedOrder: {
    quantity?: number;
    productId?: string;
    billId?: string;
  };
}

export interface GetOrderById {
  billId: string;
  orderId: string;
}

export interface GetOrderByProduct {
  productId: string;
}

export interface OrdersResponse {
  id: string;
  productId: string;
  billId: string;
  quantity: number;
  createAt: number;
  updateAt: number;
  product: ProductModel;
  bill: BillModel;
}

interface OrderState {
  isLoading: boolean;
  error: string | null;

  allOrdersClient: OrdersResponse[] | null;
  allOrdersByProduct: OrderModel[] | null;
}

const initialState: OrderState = {
  isLoading: false,
  error: null,

  allOrdersClient: null,
  allOrdersByProduct: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    GET_ORDERS: (state, _: PayloadAction<GetOrder>) => ({
      ...state,
      isLoading: true,

      error: null,
    }),

    GET_ORDERS_SUCCESS: (
      state,
      {
        payload: { allOrdersClient },
      }: PayloadAction<{ allOrdersClient: OrdersResponse[] }>,
    ) => ({
      ...state,
      isLoading: false,

      allOrdersClient,
    }),

    GET_ORDERS_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    GET_ORDERS_BY_PRODUCT: (state, _: PayloadAction<GetOrderByProduct>) => ({
      ...state,
      isLoading: true,
      error: null,

      allOrdersByProduct: null,
    }),

    GET_ORDERS_BY_PRODUCT_SUCCESS: (
      state,
      {
        payload: { allOrdersByProduct },
      }: PayloadAction<{ allOrdersByProduct: OrderModel[] }>,
    ) => ({
      ...state,
      isLoading: false,
      error: null,

      allOrdersByProduct,
    }),

    GET_ORDERS_BY_PRODUCT_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    CREATE_ORDER: (state, _: PayloadAction<NewOrder>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    CREATE_ORDER_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    CREATE_ORDER_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    UPDATE_ORDER: (state, _: PayloadAction<UpdatedOrder>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    UPDATE_ORDER_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    UPDATE_ORDER_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    REMOVE_ORDER: (state, _: PayloadAction<RemovedOrder>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    REMOVE_ORDER_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    REMOVE_ORDER_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),
  },
});

const { actions, reducer } = orderSlice;

export const orderState = initialState;

export const {
  GET_ORDERS,
  GET_ORDERS_SUCCESS,
  GET_ORDERS_FAILURE,
  GET_ORDERS_BY_PRODUCT,
  GET_ORDERS_BY_PRODUCT_SUCCESS,
  GET_ORDERS_BY_PRODUCT_FAILURE,
  CREATE_ORDER,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  UPDATE_ORDER,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAILURE,
  REMOVE_ORDER,
  REMOVE_ORDER_SUCCESS,
  REMOVE_ORDER_FAILURE,
} = actions;

export default reducer;
