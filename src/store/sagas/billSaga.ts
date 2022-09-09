import { all, call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { database } from '@database/index';

import { BillUseCase } from '@database/useCase/billUseCase';

import {
  CREATE_BILL,
  CREATE_BILL_FAILURE,
  CREATE_BILL_SUCCESS,
  BillResponse,
  GET_BILLS,
  GET_BILLS_FAILURE,
  GET_BILLS_SUCCESS,
  NewBill,
  UpdatedBill,
  RemovedBill,
  REMOVE_BILL_SUCCESS,
  REMOVE_BILL_FAILURE,
  UPDATE_BILL,
  REMOVE_BILL,
} from '@store/slices/billSlice';

function* getBills() {
  try {
    const allBills: BillResponse[] = yield call(BillUseCase.get);

    yield put(GET_BILLS_SUCCESS({ allBills }));
  } catch (error) {
    yield put(GET_BILLS_FAILURE({ error: 'something went wrong' }));
  }
}

function* createBill({ payload }: PayloadAction<NewBill>) {
  try {
    yield call(BillUseCase.create, payload);

    yield put(CREATE_BILL_SUCCESS());
  } catch (error) {
    yield put(CREATE_BILL_FAILURE({ error: 'something went wrong' }));
  }
}

function* updateBill({ payload }: PayloadAction<UpdatedBill>) {
  try {
    yield call(BillUseCase.update, payload);

    yield put(CREATE_BILL_SUCCESS());
  } catch (error) {
    yield put(CREATE_BILL_FAILURE({ error: 'something went wrong' }));
  }
}

function* removeBill({ payload }: PayloadAction<RemovedBill>) {
  try {
    yield call(BillUseCase.remove, payload);

    yield put(REMOVE_BILL_SUCCESS());
  } catch (error) {
    yield put(REMOVE_BILL_FAILURE({ error: 'something went wrong' }));
  }
}

export default function* watcher() {
  yield all([
    takeLatest(GET_BILLS, getBills),
    takeLatest(CREATE_BILL, createBill),
    takeLatest(UPDATE_BILL, updateBill),
    takeLatest(REMOVE_BILL, removeBill),
  ]);
}
