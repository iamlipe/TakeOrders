import { all, call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { SalesUseCase } from '@database/useCase/salesUseCase';
import { Sales as SalesModel } from '@database/models/salesModel';
import {
  CREATE_SALE,
  CREATE_SALE_FAILURE,
  CREATE_SALE_SUCCESS,
  GET_SALES,
  GET_SALES_FAILURE,
  GET_SALES_SUCCESS,
  NewSale,
  GetSales,
} from '@store/slices/saleSlice';

function* getSales({ payload }: PayloadAction<GetSales>) {
  try {
    const allSales: SalesModel[] = yield call(SalesUseCase.get, payload);

    yield put(GET_SALES_SUCCESS({ allSales }));
  } catch (error) {
    yield put(GET_SALES_FAILURE({ error: 'something went wrong' }));
  }
}

function* createSale({ payload }: PayloadAction<NewSale>) {
  try {
    yield call(SalesUseCase.create, payload);

    yield put(CREATE_SALE_SUCCESS());
  } catch (error) {
    yield put(CREATE_SALE_FAILURE({ error: 'something went wrong' }));
  }
}

export default function* watcher() {
  yield all([
    takeLatest(GET_SALES, getSales),
    takeLatest(CREATE_SALE, createSale),
  ]);
}
