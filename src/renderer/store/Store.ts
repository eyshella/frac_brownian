import { applyMiddleware, createStore, Store } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import { InitStore } from './Actions';
import { RootReducer } from './RootReducer';
import { RootSaga } from './RootSaga';


export function createApplicationStore(): Store {
  const sagaMiddleware = createSagaMiddleware()
  const logger = createLogger();

  const RootStore = createStore(RootReducer, applyMiddleware(logger, sagaMiddleware));
  sagaMiddleware.run(RootSaga);

  RootStore.dispatch(InitStore());
  return RootStore;
}