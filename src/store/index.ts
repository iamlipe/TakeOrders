import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import reducers from './slices';
import sagas from './sagas';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

export const store = configureStore({
  reducer: reducers,
  middleware: middlewares,
});

sagaMiddleware.run(sagas);

export type AppDispatch = typeof store.dispatch;
