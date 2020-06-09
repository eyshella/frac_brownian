import { ipcRenderer } from 'electron';
import { delay, put, select, takeLatest } from 'redux-saga/effects';

import { IpcEvents, StochasticProcessData } from '../../../models';
import { ActionWithPayload, FirstAlgorithmParams } from '../../models';
import {
  ActionTypes,
  OpenInfoModal,
  SetFirstAlgorithmLoading,
  SetFirstAlgorithmResult,
  StopFirstAlgorithm,
} from '../Actions';
import { RootState } from '../RootReducer';
import { firstAlgorithmParamsSelector, firstAlgorithmResultSelector } from '../Selectors';

function* onStartCalculation(action: ActionWithPayload) {
  yield put(SetFirstAlgorithmLoading(true));

  const state: RootState = yield select();
  const params: FirstAlgorithmParams = firstAlgorithmParamsSelector(state);
  const H = +params.HParam;
  const T = +params.TParam;
  const m = +params.mParam;
  const M = +params.MParam;
  const N = +params.numberOfPaths;
  const ParamT = +params.ParamsT;

  ipcRenderer.send(IpcEvents.StartFirstAlgorithm, H, T, m, M, N, ParamT);
}

function* onFinishCalculation(action: ActionWithPayload) {
  const state: RootState = yield select();

  const result: StochasticProcessData = firstAlgorithmResultSelector(state);

  yield put(SetFirstAlgorithmResult(action.payload[0]));

  yield put(SetFirstAlgorithmLoading(false));
}

function* onStopCalculation(action: ActionWithPayload) {
  ipcRenderer.send(IpcEvents.StopFirstAlgorithm);
  yield put(SetFirstAlgorithmLoading(false));
}

function* stopTimeout(action: ActionWithPayload) {
  if (action.type === IpcEvents.ResponseFirstAlgorithm) {
    yield put(SetFirstAlgorithmLoading(false));
    return;
  }

  const state: RootState = yield select();
  const params: FirstAlgorithmParams = firstAlgorithmParamsSelector(state);

  let timeoutMs: number = (+params.timeoutSeconds) * 1000;
  if (timeoutMs == null || Number.isNaN(timeoutMs)) {
    timeoutMs = 600000
  }
  yield delay(timeoutMs);
  if (action.type === ActionTypes.StartFirstAlgorithm) {
    yield put(StopFirstAlgorithm());
    yield put(OpenInfoModal({
      title: 'Операция была прервана!',
      description: 'Попробуйте установить большее время выполнения.'
    }));
  }
}

export function* FirstAlgorithmSagaWatcher() {
  yield takeLatest([ActionTypes.StartFirstAlgorithm], onStartCalculation);
  yield takeLatest([ActionTypes.StopFirstAlgorithm], onStopCalculation);
  yield takeLatest([IpcEvents.ResponseFirstAlgorithm], onFinishCalculation);
  yield takeLatest([ActionTypes.StartFirstAlgorithm, IpcEvents.ResponseFirstAlgorithm], stopTimeout);
}