import { all, call, put, take, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

import { SpentUseCase } from '@database/useCase/spentUseCase';

import {
  CREATE_SPENT,
  CREATE_SPENT_FAILURE,
  CREATE_SPENT_SUCCESS,
  GetSpent,
  GET_SPENT,
  GET_SPENT_FAILURE,
  GET_SPENT_SUCCESS,
  NewSpent,
  RemovedSpent,
  REMOVE_SPENT,
  REMOVE_SPENT_FAILURE,
  REMOVE_SPENT_SUCCESS,
  UpdatedSpent,
  UPDATE_SPENT,
  UPDATE_SPENT_FAILURE,
  UPDATE_SPENT_SUCCESS,
} from '@store/slices/spentSlice';

function* getSpent({ payload }: PayloadAction<GetSpent>) {
  try {
    const spentId: string = yield call(SpentUseCase.get, payload);

    yield put(GET_SPENT_SUCCESS({ spentId }));
  } catch (error) {
    yield put(GET_SPENT_FAILURE({ error: 'somethin went wrong' }));
  }
}

function* createSpent({ payload }: PayloadAction<NewSpent>) {
  try {
    yield call(SpentUseCase.create, payload);

    yield put(CREATE_SPENT_SUCCESS());
  } catch (error) {
    yield put(CREATE_SPENT_FAILURE({ error: 'something went wrong' }));
  }
}

function* updateSpent({ payload }: PayloadAction<UpdatedSpent>) {
  try {
    yield call(SpentUseCase.update, payload);

    yield put(UPDATE_SPENT_SUCCESS());
  } catch (error) {
    yield put(UPDATE_SPENT_FAILURE({ error: 'something went wrong' }));
  }
}

function* removeStock({ payload }: PayloadAction<RemovedSpent>) {
  try {
    yield call(SpentUseCase.remove, payload);

    yield put(REMOVE_SPENT_SUCCESS());
  } catch (error) {
    yield put(REMOVE_SPENT_FAILURE({ error: 'something went wrong' }));
  }
}

export default function* watcher() {
  yield all([
    takeLatest(GET_SPENT, getSpent),
    takeLatest(CREATE_SPENT, createSpent),
    takeLatest(UPDATE_SPENT, updateSpent),
    takeLatest(REMOVE_SPENT, removeStock),
  ]);
}
