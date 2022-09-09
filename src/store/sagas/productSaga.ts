import { all, put, call, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { Product as ProductModel } from '@database/models/productModel';

import { ProductUseCase } from '@database/useCase/productUseCase';

import {
  CREATE_PRODUCT,
  CREATE_PRODUCT_FAILURE,
  CREATE_PRODUCT_SUCCESS,
  GET_ALL_PRODUCTS,
  GET_ALL_PRODUCTS_FAILURE,
  GET_ALL_PRODUCTS_SUCCESS,
  NewProduct,
  RemovedProduct,
  REMOVE_PRODUCT,
  REMOVE_PRODUCT_FAILURE,
  REMOVE_PRODUCT_SUCCESS,
  UpdatedProduct,
  UPDATE_PRODUCT,
  UPDATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_SUCCESS,
} from '@store/slices/productSlice';

function* getAllProducts() {
  try {
    const allProducts: ProductModel[] = yield call(ProductUseCase.get);

    yield put(GET_ALL_PRODUCTS_SUCCESS({ allProducts }));
  } catch (error) {
    yield put(GET_ALL_PRODUCTS_FAILURE({ error: 'something went wrong' }));
  }
}

function* createProduct({ payload }: PayloadAction<NewProduct>) {
  try {
    const exist: ProductModel[] = yield call(ProductUseCase.getByName, {
      name: payload.name,
    });

    if (!exist.length) {
      yield call(ProductUseCase.create, payload);

      yield put(CREATE_PRODUCT_SUCCESS());
    } else {
      yield put(
        CREATE_PRODUCT_FAILURE({
          error: 'there is already a product with that name',
        }),
      );
    }
  } catch (error) {
    yield put(CREATE_PRODUCT_FAILURE({ error: 'something went wrong' }));
  }
}

function* updateProduct({ payload }: PayloadAction<UpdatedProduct>) {
  try {
    yield call(ProductUseCase.update, payload);

    yield put(UPDATE_PRODUCT_SUCCESS());
  } catch (error) {
    yield put(UPDATE_PRODUCT_FAILURE({ error: 'something went wrong' }));
  }
}

function* removeProduct({ payload }: PayloadAction<RemovedProduct>) {
  try {
    yield call(ProductUseCase.remove, payload);

    yield put(REMOVE_PRODUCT_SUCCESS());
  } catch (error) {
    yield put(REMOVE_PRODUCT_FAILURE({ error: 'something went wrong' }));
  }
}

export default function* watcher() {
  yield all([
    takeLatest(GET_ALL_PRODUCTS, getAllProducts),
    takeLatest(CREATE_PRODUCT, createProduct),
    takeLatest(UPDATE_PRODUCT, updateProduct),
    takeLatest(REMOVE_PRODUCT, removeProduct),
  ]);
}
