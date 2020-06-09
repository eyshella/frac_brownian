import { ipcRenderer } from 'electron';
import { delay, put, select, takeLatest } from 'redux-saga/effects';

import { IpcEvents, StochasticProcessData } from '../../../models';
import { ActionWithPayload, SecondAlgorithmParams } from '../../models';
import { ActionTypes, OpenInfoModal, SetSecondAlgorithmLoading, StopSecondAlgorithm, SetSecondAlgorithmResult } from '../Actions';
import { RootState } from '../RootReducer';
import { secondAlgorithmParamsSelector, secondAlgorithmResultSelector } from '../Selectors';


function* onStartCalculation(action: ActionWithPayload) {
  yield put(SetSecondAlgorithmLoading(true));

  const state: RootState = yield select();
  const params: SecondAlgorithmParams = secondAlgorithmParamsSelector(state);
  const H = +params.HParam;
  const Tetta = +params.TettaParam;
  const N = +params.numberOfPaths;
  const point1 = +params.point1;
  const point2 = +params.point2;

  yield put(SetSecondAlgorithmResult({
    paths: [],
  }));


  ipcRenderer.send(IpcEvents.StartSecondAlgorithm, H, Tetta, N, point1, point2);
}

function* onFinishCalculation(action: ActionWithPayload) {
  const state: RootState = yield select();

  const result: StochasticProcessData = secondAlgorithmResultSelector(state);

  yield put(SetSecondAlgorithmResult(action.payload[0]));

  yield put(SetSecondAlgorithmLoading(false));
}

function* onStopCalculation(action: ActionWithPayload) {
  ipcRenderer.send(IpcEvents.StopSecondAlgorithm);
  yield put(SetSecondAlgorithmLoading(false));
}

function* stopTimeout(action: ActionWithPayload) {
  if (action.type === IpcEvents.ResponseFirstAlgorithm) {
    yield put(SetSecondAlgorithmLoading(false));
    return;
  }

  const state: RootState = yield select();
  const params: SecondAlgorithmParams = secondAlgorithmParamsSelector(state);

  let timeoutMs: number = (+params.timeoutSeconds) * 1000;
  if (timeoutMs == null || Number.isNaN(timeoutMs)) {
    timeoutMs = 600000
  }
  yield delay(timeoutMs);
  if (action.type === ActionTypes.StartSecondAlgorithm) {
    yield put(StopSecondAlgorithm());
    yield put(OpenInfoModal({
      title: 'Операция была прервана!',
      description: 'Попробуйте установить большее время выполнения.'
    }));
  }
}

export function* SecondAlgorithmSagaWatcher() {
  yield takeLatest([ActionTypes.StartSecondAlgorithm], onStartCalculation);
  yield takeLatest([ActionTypes.StopSecondAlgorithm], onStopCalculation);
  yield takeLatest([IpcEvents.ResponseSecondAlgorithm], onFinishCalculation);
  yield takeLatest([ActionTypes.StartSecondAlgorithm, IpcEvents.ResponseSecondAlgorithm], stopTimeout);
}