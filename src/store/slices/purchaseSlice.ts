import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product as ProductModel } from '@database/models/productModel';
import { Purchase as PurchaseModel } from '@database/models/purchaseModel';

export interface PurchaseResponse {
  id: string;
  spentId: string;
  productId?: string;
  expanse?: string;
  description?: string;
  totalPrice: number;
  createdAt: number;
  updatedAt: number;

  product: ProductModel;
}

export interface NewProductPurchase {
  spentId: string;
  productId: string;
  description?: string | undefined;
  totalPrice: number;
}

export interface NewExpansePurchase {
  spentId: string;
  expanse: string;
  description?: string | undefined;
  totalPrice: number;
}

export interface RemovedPurchase {
  purchase: PurchaseModel;
}

export interface UpdatedProductPurchase extends RemovedPurchase {
  updatedPurchase: {
    spentId?: string;
    productId?: string;
    description?: string | undefined;
    totalPrice?: number;
  };
}

export interface UpdatedExpansePurchase extends RemovedPurchase {
  updatedPurchase: {
    spentId?: string;
    expanse?: string;
    description?: string | undefined;
    totalPrice?: number;
  };
}

interface purchaseState {
  isLoading: boolean;
  error: string | null;

  allPurchases: PurchaseResponse[] | undefined;
}

const initialState: purchaseState = {
  isLoading: false,
  error: null,

  allPurchases: undefined,
};

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    GET_PURCHASES: state => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    GET_PURCHASES_SUCCESS: (
      state,
      {
        payload: { allPurchases },
      }: PayloadAction<{ allPurchases: PurchaseResponse[] }>,
    ) => ({
      ...state,
      isLoading: false,

      allPurchases,
    }),

    GET_PURCHASES_FAILURE: (state, { payload: { error } }) => ({
      ...state,
      isLoading: false,

      error,
    }),

    CREATE_PRODUCT_PURCHASE: (state, _: PayloadAction<NewProductPurchase>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    CREATE_PRODUCT_PURCHASE_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    CREATE__PRODUCT_PURCHASE_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    CREATE_EXPANSE_PURCHASE: (state, _: PayloadAction<NewExpansePurchase>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    CREATE_EXPANSE_PURCHASE_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    CREATE_EXPANSE_PURCHASE_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    UPDATE_PURCHASE: (
      state,
      _: PayloadAction<UpdatedProductPurchase | UpdatedExpansePurchase>,
    ) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    UPDATE_PURCHASE_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    UPDATE_PURCHASE_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    REMOVE_PURCHASE: (state, _: PayloadAction<RemovedPurchase>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    REMOVE_PURCHASE_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    REMOVE_PURCHASE_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),
  },
});

const { actions, reducer } = purchaseSlice;

export const purchaseState = initialState;

export const {
  GET_PURCHASES,
  GET_PURCHASES_SUCCESS,
  GET_PURCHASES_FAILURE,
  CREATE_EXPANSE_PURCHASE,
  CREATE_EXPANSE_PURCHASE_SUCCESS,
  CREATE_EXPANSE_PURCHASE_FAILURE,
  CREATE_PRODUCT_PURCHASE,
  CREATE_PRODUCT_PURCHASE_SUCCESS,
  CREATE__PRODUCT_PURCHASE_FAILURE,
  UPDATE_PURCHASE,
  UPDATE_PURCHASE_SUCCESS,
  UPDATE_PURCHASE_FAILURE,
  REMOVE_PURCHASE,
  REMOVE_PURCHASE_SUCCESS,
  REMOVE_PURCHASE_FAILURE,
} = actions;

export default reducer;
