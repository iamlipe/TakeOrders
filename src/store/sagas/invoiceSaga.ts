import { all, call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

import { InvoiceUseCase } from '@database/useCase/invoiceUseCase';

import {
  CREATE_INVOICE,
  CREATE_INVOICE_FAILURE,
  CREATE_INVOICE_SUCCESS,
  GetInvoiceId,
  GET_INVOICE_ID,
  GET_INVOICE_ID_FAILURE,
  GET_INVOICE_ID_SUCCESS,
  NewInvoice,
  RemovedInvoice,
  REMOVE_iNVOICE,
  REMOVE_INVOICE_FAILURE,
  REMOVE_INVOICE_SUCCESS,
  UpdatedInvoice,
  UPDATE_INVOICE,
  UPDATE_INVOICE_FAILURE,
  UPDATE_INVOICE_SUCCESS,
} from '@store/slices/invoiceSlice';

function* getInvoiceId({ payload }: PayloadAction<GetInvoiceId>) {
  try {
    const invoiceId: string = yield call(InvoiceUseCase.getInvoiceId, payload);

    yield put(GET_INVOICE_ID_SUCCESS({ invoiceId }));
  } catch (error) {
    yield put(GET_INVOICE_ID_FAILURE({ error: 'something went wrong' }));
  }
}

function* createInvoice({ payload }: PayloadAction<NewInvoice>) {
  try {
    yield call(InvoiceUseCase.create, payload);

    yield put(CREATE_INVOICE_SUCCESS());
  } catch (error) {
    yield put(CREATE_INVOICE_FAILURE({ error: 'something went wrong' }));
  }
}

function* updateInvoice({ payload }: PayloadAction<UpdatedInvoice>) {
  try {
    yield call(InvoiceUseCase.update, payload);

    yield put(UPDATE_INVOICE_SUCCESS());
  } catch (error) {
    yield put(UPDATE_INVOICE_FAILURE({ error: 'something went wrong' }));
  }
}

function* removeInvoice({ payload }: PayloadAction<RemovedInvoice>) {
  try {
    yield call(InvoiceUseCase.remove, payload);

    yield put(REMOVE_INVOICE_SUCCESS());
  } catch (error) {
    yield put(REMOVE_INVOICE_FAILURE({ error: 'something went wrong' }));
  }
}

export default function* watcher() {
  yield all([
    takeLatest(GET_INVOICE_ID, getInvoiceId),
    takeLatest(CREATE_INVOICE, createInvoice),
    takeLatest(UPDATE_INVOICE, updateInvoice),
    takeLatest(REMOVE_iNVOICE, removeInvoice),
  ]);
}
