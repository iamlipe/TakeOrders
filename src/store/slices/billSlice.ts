import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bill as BillModel } from '@database/models/billModel';
import { State } from 'react-native-gesture-handler';

export interface NewBill {
  client: {
    name: string;
    email?: string;
    phone?: string;
  };

  invoiceId: string;
  userId: string;
}

export interface RemovedBill {
  bill: BillModel;
}

export interface UpdatedBill extends RemovedBill {
  updatedBill: {
    invoiceId?: string;
    userId?: string;
    status?: boolean;
    client: {
      name: string;
      email?: string;
      phone?: string;
    };
  };
}

export interface CloseBill {
  bill: BillModel;
}

export interface GetBillByName {
  billName: string;
}

export interface GetBillById {
  billId: string;
}

interface BillState {
  isLoading: boolean;
  error: string | null;

  allBills: BillModel[] | null;
  foundBills: BillModel[] | null;
  detailsBill: BillModel | null;
}

const initialState: BillState = {
  isLoading: false,
  error: null,

  allBills: null,
  foundBills: null,
  detailsBill: null,
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
      { payload: { allBills } }: PayloadAction<{ allBills: BillModel[] }>,
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

    GET_BILLS_BY_NAME: (state, _: PayloadAction<GetBillByName>) => ({
      ...state,
      isLoading: true,
      error: null,

      foundBills: null,
    }),

    GET_BILLS_BY_NAME_SUCCESS: (
      state,
      { payload: { foundBills } }: PayloadAction<{ foundBills: BillModel[] }>,
    ) => ({
      ...state,
      isLoading: false,
      error: null,

      foundBills,
    }),

    GET_BILLS_BY_NAME_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    GET_BILL_BY_ID: (state, _: PayloadAction<GetBillById>) => ({
      ...state,
      isLoading: true,
      error: null,

      detailsBill: null,
    }),

    GET_BILL_BY_ID_SUCCESS: (
      state,
      { payload: { detailsBill } }: PayloadAction<{ detailsBill: BillModel }>,
    ) => ({
      ...state,
      isLoading: false,
      error: null,

      detailsBill,
    }),

    GET_BILL_BY_ID_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,

      detailsBill: null,
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

    CLOSE_BILL: (state, _: PayloadAction<CloseBill>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    CLOSE_BILL_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    CLOSE_BILL_FAILURE: (
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
  GET_BILLS_BY_NAME,
  GET_BILLS_BY_NAME_SUCCESS,
  GET_BILLS_BY_NAME_FAILURE,
  GET_BILL_BY_ID,
  GET_BILL_BY_ID_SUCCESS,
  GET_BILL_BY_ID_FAILURE,
  CREATE_BILL,
  CREATE_BILL_SUCCESS,
  CREATE_BILL_FAILURE,
  UPDATE_BILL,
  UPDATE_BILL_SUCCESS,
  UPDATE_BILL_FAILURE,
  CLOSE_BILL,
  CLOSE_BILL_SUCCESS,
  CLOSE_BILL_FAILURE,
  REMOVE_BILL,
  REMOVE_BILL_SUCCESS,
  REMOVE_BILL_FAILURE,
} = actions;

export default reducer;
