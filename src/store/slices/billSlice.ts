import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Client } from '@database/models/clientModal';
import { Bill as BillModel } from '@database/models/billModel';

export interface BillResponse {
  id: string;
  status: boolean;
  invoiceId: string;
  clientId: string;
  client: Client;
}

export interface NewBill {
  invoiceId: string;
  clientId: string;
}

export interface RemovedBill {
  bill: BillModel;
}

export interface UpdatedBill extends RemovedBill {
  updatedBill: {
    invoiceId?: string;
    clientId?: string;
  };
}

interface BillState {
  isLoading: boolean;
  error: string | null;

  allBills: BillResponse[] | null;
}

const initialState: BillState = {
  isLoading: false,
  error: null,

  allBills: null,
};

const billSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    GET_BILLS: state => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    GET_BILLS_SUCCESS: (
      state,
      { payload: { allBills } }: PayloadAction<{ allBills: BillResponse[] }>,
    ) => ({
      ...state,
      isLoading: false,
      error: null,

      allBills,
    }),

    GET_BILLS_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    CREATE_BILL: (state, _: PayloadAction<NewBill>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    CREATE_BILL_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    CREATE_BILL_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    UPDATE_BILL: (state, _: PayloadAction<UpdatedBill>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    UPDATE_BILL_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    UPDATE_BILL_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    REMOVE_BILL: (state, _: PayloadAction<RemovedBill>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    REMOVE_BILL_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    REMOVE_BILL_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),
  },
});

const { actions, reducer } = billSlice;

export const billState = initialState;

export const {
  GET_BILLS,
  GET_BILLS_SUCCESS,
  GET_BILLS_FAILURE,
  CREATE_BILL,
  CREATE_BILL_SUCCESS,
  CREATE_BILL_FAILURE,
  UPDATE_BILL,
  UPDATE_BILL_SUCCESS,
  UPDATE_BILL_FAILURE,
  REMOVE_BILL,
  REMOVE_BILL_SUCCESS,
  REMOVE_BILL_FAILURE,
} = actions;

export default reducer;
