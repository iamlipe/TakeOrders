import { Stock as StockModel } from '@database/models/stockModel';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GetStock {
  userId: string;
}

export interface NewStock {
  userId: string;
}

export interface RemovedStock {
  stock: StockModel;
}

export interface UpdatedStock extends RemovedStock {
  updatedStock: {
    userId?: string;
  };
}

interface stockState {
  isLoading: boolean;
  error: string | null;

  stockId: string | null;
}

const initialState: stockState = {
  isLoading: false,
  error: null,

  stockId: null,
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    GET_STOCK: (_state, _: PayloadAction<GetStock>) => ({
      isLoading: true,
      error: null,

      stockId: null,
    }),

    GET_STOCK_SUCCESS: (
      state,
      { payload: { stockId } }: PayloadAction<{ stockId: string }>,
    ) => ({
      ...state,
      isLoading: false,

      stockId,
    }),

    GET_STOCK_FAILURE: (state, { payload: { error } }) => ({
      ...state,
      isLoading: false,

      error,
    }),

    CREATE_STOCK: (state, _: PayloadAction<NewStock>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    CREATE_STOCK_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    CREATE_STOCK_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    UPDATE_STOCK: (state, _: PayloadAction<UpdatedStock>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    UPDATE_STOCK_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    UPDATE_STOCK_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    REMOVE_STOCK: (state, _: PayloadAction<RemovedStock>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    REMOVE_STOCK_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    REMOVE_STOCK_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),
  },
});

const { actions, reducer } = stockSlice;

export const stockState = initialState;

export const {
  GET_STOCK,
  GET_STOCK_SUCCESS,
  GET_STOCK_FAILURE,
  CREATE_STOCK,
  CREATE_STOCK_SUCCESS,
  CREATE_STOCK_FAILURE,
  UPDATE_STOCK,
  UPDATE_STOCK_SUCCESS,
  UPDATE_STOCK_FAILURE,
  REMOVE_STOCK,
  REMOVE_STOCK_SUCCESS,
  REMOVE_STOCK_FAILURE,
} = actions;

export default reducer;
