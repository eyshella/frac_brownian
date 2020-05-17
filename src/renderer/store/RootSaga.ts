import { all, fork } from 'redux-saga/effects';
import { FirstAlgorithmSagaWatcher } from './sagas/FirstAlgorithmSaga';


export function* RootSaga() {
  yield all([
    fork(FirstAlgorithmSagaWatcher)
  ])
}