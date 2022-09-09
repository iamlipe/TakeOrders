import { all, call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { database } from '@database/index';

import { OrderUseCase } from '@database/useCase/orderUseCase';

import {
  GetOrder,
  GETL_ORDERS,
  GETL_ORDERS_SUCCESS,
  GETL_ORDERS_FAILURE,
  NewOrder,
  CREATE_ORDER_FAILURE,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER,
  OrdersResponse,
  RemovedOrder,
  UpdatedOrder,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAILURE,
  REMOVE_ORDER_SUCCESS,
  REMOVE_ORDER_FAILURE,
  UPDATE_ORDER,
  REMOVE_ORDER,
} from '@store/slices/orderSlice';

function* getOrders({ payload }: PayloadAction<GetOrder>) {
  try {
    const allOrdersClient: OrdersResponse[] = yield call(OrderUseCase.get, {
      billId: payload.billId,
    });

    yield put(GETL_ORDERS_SUCCESS({ allOrdersClient }));
  } catch (error) {
    yield put(GETL_ORDERS_FAILURE({ error: 'something went wrong' }));
  }
}

function* addNewOrder({ payload }: PayloadAction<NewOrder>) {
  try {
    yield call(OrderUseCase.create, payload);

    yield put(CREATE_ORDER_SUCCESS());
  } catch (error) {
    yield put(CREATE_ORDER_FAILURE({ error: 'something went wrong' }));
  }
}

function* updateOrder({ payload }: PayloadAction<UpdatedOrder>) {
  try {
    yield call(OrderUseCase.update, payload);

    yield put(UPDATE_ORDER_SUCCESS());
  } catch (error) {
    yield put(UPDATE_ORDER_FAILURE({ error: 'something went wrong' }));
  }
}

function* removeOrder({ payload }: PayloadAction<RemovedOrder>) {
  try {
    yield call(OrderUseCase.remove, payload);

    yield put(REMOVE_ORDER_SUCCESS());
  } catch (error) {
    yield put(REMOVE_ORDER_FAILURE({ error: 'something went wrong' }));
  }
}

export default function* watcher() {
  yield all([
    takeLatest(GETL_ORDERS, getOrders),
    takeLatest(CREATE_ORDER, addNewOrder),
    takeLatest(UPDATE_ORDER, updateOrder),
    takeLatest(REMOVE_ORDER, removeOrder),
  ]);
}
