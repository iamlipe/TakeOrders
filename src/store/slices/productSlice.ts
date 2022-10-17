import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product as ProductModel } from '@database/models/productModel';

export interface NewProduct {
  stockId: string;
  name: string;
  type: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface GetProducsByName {
  name: string;
}

export interface GetProductById {
  productId: string;
}

export interface RemovedProduct {
  product: ProductModel;
}

export interface UpdatedProduct extends RemovedProduct {
  updatedProduct: {
    stockId?: string;
    name?: string;
    type?: string;
    image?: string;
    price?: number;
    quantity?: number;
  };
}

interface ProductState {
  isLoading: boolean;
  error: null | string;

  allProducts: ProductModel[] | null;
  foundProducts: ProductModel[] | null;
  selectedProduct: ProductModel | null;
  latestProductCreated: ProductModel | null;
}

const initialState: ProductState = {
  isLoading: false,
  error: null,

  allProducts: null,
  foundProducts: null,
  selectedProduct: null,
  latestProductCreated: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    GET_ALL_PRODUCTS: state => ({
      ...state,
      isLoading: true,
    }),

    GET_ALL_PRODUCTS_SUCCESS: (
      state,
      {
        payload: { allProducts },
      }: PayloadAction<{ allProducts: ProductModel[] }>,
    ) => ({
      ...state,
      isLoading: false,

      allProducts,
    }),

    GET_ALL_PRODUCTS_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error: error,

      allProducts: null,
    }),

    GET_PRODUCTS_BY_NAME: (state, _: PayloadAction<GetProducsByName>) => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    GET_PRODUCTS_BY_NAME_SUCCESS: (
      state,
      {
        payload: { foundProducts },
      }: PayloadAction<{ foundProducts: ProductModel[] }>,
    ) => ({
      ...state,
      isLoading: false,
      error: null,

      foundProducts,
    }),

    GET_PRODUCTS_BY_NAME_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    GET_PRODUCT_BY_ID: (state, _: PayloadAction<GetProductById>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    GET_PRODUCT_BY_ID_SUCCESS: (
      state,
      {
        payload: { selectedProduct },
      }: PayloadAction<{ selectedProduct: ProductModel }>,
    ) => ({
      ...state,
      isLoading: false,
      error: null,

      selectedProduct,
    }),

    GET_PRODUCT_BY_ID_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    CREATE_PRODUCT: (state, _: PayloadAction<NewProduct>) => ({
      ...state,
      isLoading: true,
      error: null,

      latestProductCreated: null,
    }),

    CREATE_PRODUCT_SUCCESS: (
      state,
      {
        payload: { latestProductCreated },
      }: PayloadAction<{ latestProductCreated: ProductModel }>,
    ) => ({
      ...state,
      isLoading: false,
      error: null,

      latestProductCreated,
    }),

    CREATE_PRODUCT_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    UPDATE_PRODUCT: (state, _: PayloadAction<UpdatedProduct>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    UPDATE_PRODUCT_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    UPDATE_PRODUCT_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    REMOVE_PRODUCT: (state, _) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    REMOVE_PRODUCT_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    REMOVE_PRODUCT_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),
  },
});

const { actions, reducer } = productSlice;

export const productState = initialState;

export const {
  GET_ALL_PRODUCTS,
  GET_ALL_PRODUCTS_FAILURE,
  GET_ALL_PRODUCTS_SUCCESS,
  GET_PRODUCTS_BY_NAME,
  GET_PRODUCTS_BY_NAME_SUCCESS,
  GET_PRODUCTS_BY_NAME_FAILURE,
  GET_PRODUCT_BY_ID,
  GET_PRODUCT_BY_ID_SUCCESS,
  GET_PRODUCT_BY_ID_FAILURE,
  CREATE_PRODUCT,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  REMOVE_PRODUCT,
  REMOVE_PRODUCT_SUCCESS,
  REMOVE_PRODUCT_FAILURE,
} = actions;

export default reducer;
