import { all, call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { Client as ClientModal } from '@database/models/clientModal';

import { ClientUseCase } from '@database/useCase/clientUseCase';

import {
  GetClients,
  GET_ALL_CLIENTS,
  GET_ALL_CLIENTS_SUCCESS,
  GET_ALL_CLIENTS_FAILURE,
  NewClient,
  CREATE_CLIENT_SUCCESS,
  CREATE_CLIENT_FAILURE,
  CREATE_CLIENT,
  UpdatedClient,
  UPDATE_CLIENT_SUCCESS,
  UPDATE_CLIENT_FAILURE,
  RemovedClient,
  REMOVE_CLIENT_SUCCESS,
  REMOVE_CLIENT_FAILURE,
  UPDATE_CLIENT,
  REMOVE_CLIENT,
} from '@store/slices/clientSlice';

function* getAllClients({ payload }: PayloadAction<GetClients>) {
  try {
    const allClients: ClientModal[] = yield call(ClientUseCase.get, payload);

    yield put(GET_ALL_CLIENTS_SUCCESS({ allClients }));
  } catch (error) {
    yield put(GET_ALL_CLIENTS_FAILURE({ error: 'something went wrong' }));
  }
}

function* createClient({ payload }: PayloadAction<NewClient>) {
  try {
    yield call(ClientUseCase.create, payload);

    yield put(CREATE_CLIENT_SUCCESS());
  } catch (error) {
    yield put(CREATE_CLIENT_FAILURE({ error: 'something went wrong' }));
  }
}

function* updateClient({ payload }: PayloadAction<UpdatedClient>) {
  try {
    yield call(ClientUseCase.update, payload);

    yield put(UPDATE_CLIENT_SUCCESS());
  } catch (error) {
    yield put(UPDATE_CLIENT_FAILURE({ error: 'something went wrong' }));
  }
}

function* removeClient({ payload }: PayloadAction<RemovedClient>) {
  try {
    yield call(ClientUseCase.remove, payload);

    yield put(REMOVE_CLIENT_SUCCESS());
  } catch (error) {
    yield put(REMOVE_CLIENT_FAILURE({ error: 'something went wrong' }));
  }
}

export default function* watcher() {
  yield all([
    takeLatest(GET_ALL_CLIENTS, getAllClients),
    takeLatest(CREATE_CLIENT, createClient),
    takeLatest(UPDATE_CLIENT, updateClient),
    takeLatest(REMOVE_CLIENT, removeClient),
  ]);
}
