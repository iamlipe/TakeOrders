import { takeLatest, all, put, call } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

import { UserUseCase } from '@database/useCase/usersUseCase';
import { StockUseCase } from '@database/useCase/stockUseCase';
import { SpentUseCase } from '@database/useCase/spentUseCase';
import { InvoiceUseCase } from '@database/useCase/invoiceUseCase';
import { User as UserModel } from '@database/models/userModel';

import {
  Login,
  LOGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  Register,
  REGISTER,
  REGISTER_FAILURE,
  REGISTER_SUCCESS,
} from '@store/slices/userSlice';

function* login({ payload }: PayloadAction<Login>) {
  try {
    const auth: UserModel[] = yield call(UserUseCase.get, payload);

    const user = {
      id: auth[0].id,
      name: auth[0].name,
      email: auth[0].email,
      phone: auth[0].phone,
    };

    yield put(LOGIN_SUCCESS({ data: user }));
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

export default function* watcher() {
  yield all([takeLatest(LOGIN, login), takeLatest(REGISTER, register)]);
}
