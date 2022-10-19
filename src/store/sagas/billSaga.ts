import { all, call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { BillUseCase } from '@database/useCase/billUseCase';
import { Bill as BillModel } from '@database/models/billModel';

import {
  CREATE_BILL,
  CREATE_BILL_FAILURE,
  CREATE_BILL_SUCCESS,
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
  GET_BILLS_BY_NAME_SUCCESS,
  GET_BILLS_BY_NAME_FAILURE,
  GetBillByName,
  GET_BILLS_BY_NAME,
  GetBillById,
  GET_BILL_BY_ID_SUCCESS,
  GET_BILL_BY_ID_FAILURE,
  GET_BILL_BY_ID,
  CloseBill,
  CLOSE_BILL_SUCCESS,
  CLOSE_BILL_FAILURE,
  CLOSE_BILL,
} from '@store/slices/billSlice';

function* getOpenBills() {
  try {
    const allBills: BillModel[] = yield call(BillUseCase.getOpenBills);

    yield put(GET_BILLS_SUCCESS({ allBills }));
  } catch (error) {
    yield put(GET_BILLS_FAILURE({ error: 'something went wrong' }));
  }
}

function* getBillsByName({ payload }: PayloadAction<GetBillByName>) {
  try {
    const foundBills: BillModel[] = yield call(BillUseCase.getByName, payload);

    console.log(foundBills);

    yield put(GET_BILLS_BY_NAME_SUCCESS({ foundBills }));
  } catch (error) {
    yield put(GET_BILLS_BY_NAME_FAILURE({ error: 'something went wrong' }));
  }
}

function* getBillsById({ payload }: PayloadAction<GetBillById>) {
  try {
    const detailsBill: BillModel = yield call(BillUseCase.getById, payload);

    yield put(GET_BILL_BY_ID_SUCCESS({ detailsBill }));
  } catch (error) {
    yield put(GET_BILL_BY_ID_FAILURE({ error: 'something went wrong' }));
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

function* closeBill({ payload }: PayloadAction<CloseBill>) {
  try {
    yield call(BillUseCase.closeBill, payload);

    yield put(CLOSE_BILL_SUCCESS());
  } catch (error) {
    yield put(CLOSE_BILL_FAILURE({ error: 'something went wrong' }));
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
    takeLatest(GET_BILLS, getOpenBills),
    takeLatest(GET_BILLS_BY_NAME, getBillsByName),
    takeLatest(GET_BILL_BY_ID, getBillsById),
    takeLatest(CREATE_BILL, createBill),
    takeLatest(UPDATE_BILL, updateBill),
    takeLatest(CLOSE_BILL, closeBill),
    takeLatest(REMOVE_BILL, removeBill),
  ]);
}
