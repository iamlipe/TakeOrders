import { all, call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { Order as OrderModel } from '@database/models/orderModel';

import { OrderUseCase } from '@database/useCase/orderUseCase';

import {
  GetOrder,
  GET_ORDERS,
  GET_ORDERS_SUCCESS,
  GET_ORDERS_FAILURE,
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
  GetOrderByProduct,
  GET_ORDERS_BY_PRODUCT_SUCCESS,
  GET_ORDERS_BY_PRODUCT_FAILURE,
  GET_ORDERS_BY_PRODUCT,
} from '@store/slices/orderSlice';

function* getOrders({ payload }: PayloadAction<GetOrder>) {
  try {
    const allOrdersClient: OrdersResponse[] = yield call(
      OrderUseCase.get,
      payload,
    );

    yield put(GET_ORDERS_SUCCESS({ allOrdersClient }));
  } catch (error) {
    yield put(GET_ORDERS_FAILURE({ error: 'something went wrong' }));
  }
}

function* getAllByProduct({ payload }: PayloadAction<GetOrderByProduct>) {
  try {
    const allOrdersByProduct: OrderModel[] = yield call(
      OrderUseCase.getByProduct,
      payload,
    );

    yield put(GET_ORDERS_BY_PRODUCT_SUCCESS({ allOrdersByProduct }));
  } catch (error) {
    yield put(GET_ORDERS_BY_PRODUCT_FAILURE({ error: 'something went wrong' }));
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
    takeLatest(GET_ORDERS, getOrders),
    takeLatest(GET_ORDERS_BY_PRODUCT, getAllByProduct),
    takeLatest(CREATE_ORDER, addNewOrder),
    takeLatest(UPDATE_ORDER, updateOrder),
    takeLatest(REMOVE_ORDER, removeOrder),
  ]);
}
