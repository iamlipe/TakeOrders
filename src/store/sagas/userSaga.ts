import { takeLatest, all, put, call } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

import { UserUseCase } from '@database/useCase/usersUseCase';
import { StockUseCase } from '@database/useCase/stockUseCase';
import { SpentUseCase } from '@database/useCase/spentUseCase';
import { InvoiceUseCase } from '@database/useCase/invoiceUseCase';
import { User as UserModel } from '@database/models/userModel';
import { useUserStorage } from '@hooks/useUserStorage';

import {
  GET_DEFAULT_USER,
  GET_DEFAULT_USER_FAILURE,
  GET_DEFAULT_USER_SUCCESS,
  Login,
  LOGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT,
  LOGOUT_FAILURE,
  LOGOUT_SUCCESS,
  Register,
  REGISTER,
  REGISTER_FAILURE,
  REGISTER_SUCCESS,
} from '@store/slices/userSlice';

function* login({ payload }: PayloadAction<Login>) {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const userStorage = useUserStorage();

    const auth: UserModel[] = yield call(UserUseCase.get, payload);

    if (auth.length) {
      const user = {
        id: auth[0].id,
        name: auth[0].name,
        email: auth[0].email,
        phone: auth[0].phone,
        password: auth[0].password,
      };

      yield call(userStorage.save, 'user', user);

      yield put(LOGIN_SUCCESS({ data: user }));
    } else {
      yield put(LOGIN_FAILURE({ error: 'unregistered user' }));
    }
  } catch (error) {
    yield put(LOGIN_FAILURE({ error: 'something went wrong' }));
  }
}

function* register({ payload }: PayloadAction<Register>) {
  try {
    const { email } = payload;

    const exist: UserModel[] = yield call(UserUseCase.getByEmail, { email });

    if (!exist.length) {
      const newUser: UserModel[] = yield call(UserUseCase.create, payload);

      yield call(StockUseCase.create, { userId: newUser[0].id });
      yield call(SpentUseCase.create, { userId: newUser[0].id });
      yield call(InvoiceUseCase.create, { userId: newUser[0].id });

      yield put(REGISTER_SUCCESS());
    } else {
      yield put(REGISTER_FAILURE({ error: 'email already registered' }));
    }
  } catch (error) {
    yield put(REGISTER_FAILURE({ error: 'something went wrong' }));
  }
}

function* getDefaultUser({ payload }: PayloadAction<{ email: string }>) {
  try {
    const { email } = payload;

    const data: UserModel[] = yield call(UserUseCase.getByEmail, { email });

    if (data.length) {
      const user = {
        id: data[0].id,
        name: data[0].name,
        email: data[0].email,
        phone: data[0].phone,
        password: data[0].password,
      };

      yield put(GET_DEFAULT_USER_SUCCESS({ user }));
    } else {
      yield put(
        GET_DEFAULT_USER_FAILURE({ error: 'unregistered default user' }),
      );
    }
  } catch (error) {
    yield put(GET_DEFAULT_USER_FAILURE({ error: 'something went wrong' }));
  }
}

export function* logout() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const userStorage = useUserStorage();

    yield call(userStorage.remove, 'user');
    yield put(LOGOUT_SUCCESS());
  } catch (error) {
    yield put(LOGOUT_FAILURE({ error: 'something went wrong' }));
  }
}

export default function* watcher() {
  yield all([
    takeLatest(LOGIN, login),
    takeLatest(REGISTER, register),
    takeLatest(GET_DEFAULT_USER, getDefaultUser),
    takeLatest(LOGOUT, logout),
  ]);
}
