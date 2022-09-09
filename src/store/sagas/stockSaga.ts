import { all, call, put, take, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

import { StockUseCase } from '@database/useCase/stockUseCase';

import {
  CREATE_STOCK,
  CREATE_STOCK_FAILURE,
  CREATE_STOCK_SUCCESS,
  GetStock,
  GET_STOCK,
  GET_STOCK_FAILURE,
  GET_STOCK_SUCCESS,
  NewStock,
  RemovedStock,
  REMOVE_STOCK,
  REMOVE_STOCK_FAILURE,
  REMOVE_STOCK_SUCCESS,
  UpdatedStock,
  UPDATE_STOCK,
  UPDATE_STOCK_FAILURE,
  UPDATE_STOCK_SUCCESS,
} from '@store/slices/stockSlice';

function* getStock({ payload }: PayloadAction<GetStock>) {
  try {
    const stockId: string = yield call(StockUseCase.get, payload);

    yield put(GET_STOCK_SUCCESS({ stockId }));
  } catch (error) {
    yield put(GET_STOCK_FAILURE({ error: 'somethin went wrong' }));
  }
}

function* createStock({ payload }: PayloadAction<NewStock>) {
  try {
    yield call(StockUseCase.create, payload);

    yield put(CREATE_STOCK_SUCCESS());
  } catch (error) {
    yield put(CREATE_STOCK_FAILURE({ error: 'something went wrong' }));
  }
}

function* updateStock({ payload }: PayloadAction<UpdatedStock>) {
  try {
    yield call(StockUseCase.update, payload);

    yield put(UPDATE_STOCK_SUCCESS());
  } catch (error) {
    yield put(UPDATE_STOCK_FAILURE({ error: 'something went wrong' }));
  }
}

function* removeStock({ payload }: PayloadAction<RemovedStock>) {
  try {
    yield call(StockUseCase.remove, payload);

    yield put(REMOVE_STOCK_SUCCESS());
  } catch (error) {
    yield put(REMOVE_STOCK_FAILURE({ error: 'something went wrong' }));
  }
}

export default function* watcher() {
  yield all([
    takeLatest(GET_STOCK, getStock),
    takeLatest(CREATE_STOCK, createStock),
    takeLatest(UPDATE_STOCK, updateStock),
    takeLatest(REMOVE_STOCK, removeStock),
  ]);
}
