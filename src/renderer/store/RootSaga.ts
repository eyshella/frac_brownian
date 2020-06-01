import { all, fork } from 'redux-saga/effects';
import { FirstAlgorithmSagaWatcher } from './sagas/FirstAlgorithmSaga';
import { SecondAlgorithmSagaWatcher } from './sagas/SecondAlgorithmSaga';


export function* RootSaga() {
  yield all([
    fork(FirstAlgorithmSagaWatcher),
    fork(SecondAlgorithmSagaWatcher)
  ])
}