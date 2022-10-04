import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Invoice as InvoiceModel } from '@database/models/invoiceModel';

export interface GetInvoiceId {
  userId: string;
}

export interface GetInvoice {
  userId: string;
}

export interface NewInvoice {
  userId: string;
}

export interface RemovedInvoice {
  invoice: InvoiceModel;
}

export interface InvoiceResponse {
  id: string;
  name: string;
  price: number;
  createdAt: number;
  updatedAt: number;
}

export interface UpdatedInvoice extends RemovedInvoice {
  updatedInvoice: NewInvoice;
}

interface InvoiceState {
  isLoading: boolean;
  error: string | null;

  invoiceId: string | null;

  allInvoicies: InvoiceResponse[] | null;
}

const initialState: InvoiceState = {
  isLoading: false,
  error: null,

  invoiceId: null,
  allInvoicies: null,
};

const InvoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    GET_INVOICE_ID: (state, _: PayloadAction<GetInvoice>) => ({
      ...state,
      isLoading: true,
      error: null,

      invoiceId: null,
    }),

    GET_INVOICE_ID_SUCCESS: (
      state,
      { payload: { invoiceId } }: PayloadAction<{ invoiceId: string }>,
    ) => ({
      ...state,
      isLoading: false,

      invoiceId,
    }),

    GET_INVOICE_ID_FAILURE: (state, { payload: { error } }) => ({
      ...state,
      isLoading: false,
      error,
    }),

    GET_INVOICE: (state, _: PayloadAction<GetInvoice>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    GET_INVOICE_SUCCESS: (
      state,
      {
        payload: { allInvoicies },
      }: PayloadAction<{ allInvoicies: InvoiceResponse[] }>,
    ) => ({
      ...state,
      isLoading: false,
      error: null,

      allInvoicies,
    }),

    GET_INVOICE_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    CREATE_INVOICE: (state, _: PayloadAction<NewInvoice>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    CREATE_INVOICE_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    CREATE_INVOICE_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    UPDATE_INVOICE: (state, _: PayloadAction<UpdatedInvoice>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    UPDATE_INVOICE_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    UPDATE_INVOICE_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),

    REMOVE_iNVOICE: (state, _: PayloadAction<RemovedInvoice>) => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    REMOVE_INVOICE_SUCCESS: state => ({
      ...state,
      isLoading: false,
      error: null,
    }),

    REMOVE_INVOICE_FAILURE: (
      state,
      { payload: { error } }: PayloadAction<{ error: string }>,
    ) => ({
      ...state,
      isLoading: false,
      error,
    }),
  },
});

const { actions, reducer } = InvoiceSlice;

export const invoiceState = initialState;

export const {
  GET_INVOICE_ID,
  GET_INVOICE_ID_SUCCESS,
  GET_INVOICE_ID_FAILURE,
  GET_INVOICE,
  GET_INVOICE_SUCCESS,
  GET_INVOICE_FAILURE,
  CREATE_INVOICE,
  CREATE_INVOICE_SUCCESS,
  CREATE_INVOICE_FAILURE,
  UPDATE_INVOICE,
  UPDATE_INVOICE_SUCCESS,
  UPDATE_INVOICE_FAILURE,
  REMOVE_iNVOICE,
  REMOVE_INVOICE_SUCCESS,
  REMOVE_INVOICE_FAILURE,
} = actions;

export default reducer;
