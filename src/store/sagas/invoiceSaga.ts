import { all, call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

import { InvoiceUseCase } from '@database/useCase/invoiceUseCase';

import {
  CREATE_INVOICE,
  CREATE_INVOICE_FAILURE,
  CREATE_INVOICE_SUCCESS,
  GetInvoice,
  GetInvoiceId,
  GET_INVOICE,
  GET_INVOICE_FAILURE,
  GET_INVOICE_ID,
  GET_INVOICE_ID_FAILURE,
  GET_INVOICE_ID_SUCCESS,
  GET_INVOICE_SUCCESS,
  InvoiceResponse,
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
import { SalesUseCase } from '@database/useCase/salesUseCase';
import { PurchaseUseCase } from '@database/useCase/purchaseUseCase';
import { Sales as SalesModel } from '@database/models/salesModel';
import { Purchase as PurchaseModel } from '@database/models/purchaseModel';
import { PurchaseResponse } from '@store/slices/purchaseSlice';

function* getInvoiceId({ payload }: PayloadAction<GetInvoiceId>) {
  try {
    const invoiceId: string = yield call(InvoiceUseCase.getInvoiceId, payload);

    yield put(GET_INVOICE_ID_SUCCESS({ invoiceId }));
  } catch (error) {
    yield put(GET_INVOICE_ID_FAILURE({ error: 'something went wrong' }));
  }
}

function* getIncoivce({ payload }: PayloadAction<GetInvoice>) {
  try {
    const dataSales: SalesModel[] = yield call(SalesUseCase.get, payload);
    const dataPurchases: PurchaseResponse[] = yield call(PurchaseUseCase.get);

    const allSales = dataSales.map((item): InvoiceResponse => {
      return {
        id: item.id,
        name: item.name,
        price: item.totalPrice,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    const allPurchases = dataPurchases.map(item => {
      return {
        id: item.id,
        name: item.expanse || '',
        price: item.totalPrice,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    const allInvoicies: InvoiceResponse[] = [...allPurchases, ...allSales].sort(
      (a, b) => b.createdAt - a.createdAt,
    );

    yield put(GET_INVOICE_SUCCESS({ allInvoicies }));
  } catch (error) {
    console.log(error);

    yield put(GET_INVOICE_FAILURE({ error: 'something went wrong' }));
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
    takeLatest(GET_INVOICE, getIncoivce),
    takeLatest(CREATE_INVOICE, createInvoice),
    takeLatest(UPDATE_INVOICE, updateInvoice),
    takeLatest(REMOVE_iNVOICE, removeInvoice),
  ]);
}
