import { all, call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { Purchase as PurchaseModel } from '@database/models/purchaseModel';
import { PurchaseUseCase } from '@database/useCase/purchaseUseCase';

import {
  CREATE_EXPANSE_PURCHASE,
  CREATE_EXPANSE_PURCHASE_SUCCESS,
  CREATE_EXPANSE_PURCHASE_FAILURE,
  CREATE_PRODUCT_PURCHASE,
  CREATE_PRODUCT_PURCHASE_SUCCESS,
  CREATE__PRODUCT_PURCHASE_FAILURE,
  GET_PURCHASES,
  GET_PURCHASES_FAILURE,
  GET_PURCHASES_SUCCESS,
  NewExpansePurchase,
  NewProductPurchase,
  RemovedPurchase,
  REMOVE_PURCHASE,
  REMOVE_PURCHASE_FAILURE,
  REMOVE_PURCHASE_SUCCESS,
  UpdatedExpansePurchase,
  UpdatedProductPurchase,
  UPDATE_PURCHASE,
  UPDATE_PURCHASE_FAILURE,
  UPDATE_PURCHASE_SUCCESS,
} from '@store/slices/purchaseSlice';
import { ProductUseCase } from '@database/useCase/productUseCase';

function* getPurchases() {
  try {
    const allPurchases: PurchaseModel[] = yield call(PurchaseUseCase.get);

    yield put(GET_PURCHASES_SUCCESS({ allPurchases }));
  } catch (error) {
    yield put(GET_PURCHASES_FAILURE({ error: 'something went wrong' }));
  }
}

function* createProductPurchase({
  payload,
}: PayloadAction<NewProductPurchase>) {
  try {
    const exist: ProductUseCase[] = yield call(ProductUseCase.getById, payload);

    if (exist) {
      yield call(PurchaseUseCase.createProduct, payload);

      yield put(CREATE_PRODUCT_PURCHASE_SUCCESS());
    } else {
      yield put(
        CREATE__PRODUCT_PURCHASE_FAILURE({ error: 'product does not exist' }),
      );
    }
  } catch (error) {
    yield put(
      CREATE__PRODUCT_PURCHASE_FAILURE({ error: 'something went wrong' }),
    );
  }
}

function* createExpansePurchase({
  payload,
}: PayloadAction<NewExpansePurchase>) {
  try {
    yield call(PurchaseUseCase.createExpanse, payload);

    yield put(CREATE_EXPANSE_PURCHASE_SUCCESS());
  } catch (error) {
    yield put(
      CREATE_EXPANSE_PURCHASE_FAILURE({ error: 'something went wrong' }),
    );
  }
}

function* updateProductPurchase({
  payload,
}: PayloadAction<UpdatedProductPurchase>) {
  try {
    yield call(PurchaseUseCase.updateProduct, payload);

    yield put(UPDATE_PURCHASE_SUCCESS());
  } catch (error) {
    yield put(UPDATE_PURCHASE_FAILURE({ error: 'something went wrong' }));
  }
}

function* updateExpansePurchase({
  payload,
}: PayloadAction<UpdatedExpansePurchase>) {
  try {
    yield call(PurchaseUseCase.updateExpanse, payload);

    yield put(UPDATE_PURCHASE_SUCCESS());
  } catch (error) {
    yield put(UPDATE_PURCHASE_FAILURE({ error: 'something went wrong' }));
  }
}

function* removeStock({ payload }: PayloadAction<RemovedPurchase>) {
  try {
    yield call(PurchaseUseCase.remove, payload);

    yield put(REMOVE_PURCHASE_SUCCESS());
  } catch (error) {
    yield put(REMOVE_PURCHASE_FAILURE({ error: 'something went wrong' }));
  }
}

export default function* watcher() {
  yield all([
    takeLatest(GET_PURCHASES, getPurchases),
    takeLatest(CREATE_PRODUCT_PURCHASE, createProductPurchase),
    takeLatest(CREATE_EXPANSE_PURCHASE, createExpansePurchase),
    takeLatest(UPDATE_PURCHASE, updateProductPurchase),
    takeLatest(UPDATE_PURCHASE, updateExpansePurchase),
    takeLatest(REMOVE_PURCHASE, removeStock),
  ]);
}
