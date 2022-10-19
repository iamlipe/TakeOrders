import { all, call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

import {
  GetProfit,
  GET_PROFIT,
  GET_PROFIT_FAILURE,
  GET_PROFIT_SUCCESS,
  ProfitResponse,
} from '@store/slices/profitSlice';

import { SalesUseCase } from '@database/useCase/salesUseCase';
import { PurchaseUseCase } from '@database/useCase/purchaseUseCase';
import { Sales as SalesModel } from '@database/models/salesModel';
import { PurchaseResponse } from '@store/slices/purchaseSlice';

function* getProfit({ payload }: PayloadAction<GetProfit>) {
  try {
    const dataSales: SalesModel[] = yield call(SalesUseCase.get, payload);
    const dataPurchases: PurchaseResponse[] = yield call(PurchaseUseCase.get);

    const allSales = dataSales.map((item): ProfitResponse => {
      return {
        id: item.id,
        name: item.name,
        price: item.totalPrice,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    const allPurchases = dataPurchases.map(item => {
      return {
        id: item.id,
        name: item.expanse || '',
        price: item.totalPrice,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    const allProfit: ProfitResponse[] = [...allPurchases, ...allSales].sort(
      (a, b) => b.createdAt - a.createdAt,
    );

    yield put(GET_PROFIT_SUCCESS({ allProfit }));
  } catch (error) {

    yield put(GET_PROFIT_FAILURE({ error: 'something went wrong' }));
  }
}

export default function* watcher() {
  yield all([takeLatest(GET_PROFIT, getProfit)]);
}
