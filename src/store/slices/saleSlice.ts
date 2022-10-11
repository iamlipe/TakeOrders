import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Sales as SalesModel } from '@database/models/salesModel';

export interface NewSale {
  userId: string;
  name: string;
  totalPrice: number;
}

export interface GetSales {
  userId: string;
}

interface saleState {
  isLoading: boolean;
  error: string | null;

  allSales: SalesModel[] | undefined;
}

const initialState: saleState = {
  isLoading: false,
  error: null,

  allSales: undefined,
};

const saleSlice = createSlice({
  name: 'sale',
  initialState,
  reducers: {
    GET_SALES: (state, _: PayloadAction<GetSales>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    GET_SALES_SUCCESS: (
      state,
      { payload: { allSales } }: PayloadAction<{ allSales: SalesModel[] }>,
    ) => ({
      ...state,
      isLoading: false,
      error: null,

      allSales,
    }),

    GET_SALES_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    CREATE_SALE: (state, _: PayloadAction<NewSale>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    CREATE_SALE_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    CREATE_SALE_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),
  },
});

const { actions, reducer } = saleSlice;

export const saleState = initialState;

export const {
  GET_SALES,
  GET_SALES_SUCCESS,
  GET_SALES_FAILURE,
  CREATE_SALE,
  CREATE_SALE_SUCCESS,
  CREATE_SALE_FAILURE,
} = actions;

export default reducer;
