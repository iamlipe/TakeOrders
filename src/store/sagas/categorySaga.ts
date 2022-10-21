import { all, call, put, takeLatest } from 'redux-saga/effects';

import {
  CREATE_CATEGORY,
  CREATE_CATEGORY_FAILURE,
  CREATE_CATEGORY_SUCCESS,
  GET_CATEGORIES,
  GET_CATEGORIES_FAILURE,
  GET_CATEGORIES_SUCCESS,
  NewCategory,
} from '@store/slices/categorySlice';

import { Category as CategoryModel } from '@database/models/categoryModel';
import { CategoryUseCase } from '@database/useCase/categoryUseCase';
import { PayloadAction } from '@reduxjs/toolkit';

function* getCategories() {
  try {
    const allCategories: CategoryModel[] = yield call(CategoryUseCase.get);

    yield put(GET_CATEGORIES_SUCCESS({ allCategories }));
  } catch (error) {
    yield put(GET_CATEGORIES_FAILURE({ error: 'something went wrong' }));
  }
}

function* createCategory({ payload }: PayloadAction<NewCategory>) {
  try {
    yield call(CategoryUseCase.create, payload);

    yield put(CREATE_CATEGORY_SUCCESS());
  } catch (error) {
    yield put(CREATE_CATEGORY_FAILURE({ error: 'something went wrong' }));
  }
}

export default function* watcher() {
  yield all([
    takeLatest(GET_CATEGORIES, getCategories),
    takeLatest(CREATE_CATEGORY, createCategory),
  ]);
}
