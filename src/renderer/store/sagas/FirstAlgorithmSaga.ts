import { ipcRenderer } from 'electron';
import { call, delay, put, select, takeLatest } from 'redux-saga/effects';

import { ActionWithPayload, FirstAlgorithmParams, Point, BrownianMotionResult } from '../../models';
import { ActionTypes, SetFirstAlgorithmLoading, SetFirstAlgorithmResult, StopFirstAlgorithm, OpenInfoModal } from '../Actions';
import { RootState } from '../RootReducer';
import { firstAlgorithmParamsSelector } from '../Selectors';
import { IpcEvents } from '../../../models';


function* startStopCalculation(action: ActionWithPayload) {
  if (action.type === ActionTypes.StopFirstAlgorithm) {
    yield put(SetFirstAlgorithmLoading(false));
    ipcRenderer.send(IpcEvents.StopFirstAlgorithm);
    return;
  }

  yield put(SetFirstAlgorithmLoading(true));

  const state: RootState = yield select();
  const params: FirstAlgorithmParams = firstAlgorithmParamsSelector(state);
  const H = +params.HParam;
  const T = +params.TParam;
  const m = +params.mParam;
  const M = +params.MParam;

  const runCalculationPromise = new Promise((resolve, reject) => {
    ipcRenderer.once(IpcEvents.ResponseFirstAlgorithm, (event: any, result: BrownianMotionResult | null) => {
      if (result == null) {
        reject();
      }
      resolve(result);
    })
    ipcRenderer.send(IpcEvents.StartFirstAlgorithm, H, T, m, M);
  })

  try {
    const result: BrownianMotionResult = yield call(() => runCalculationPromise);
    
    if (result.fileSize != null && result.fileSize > 20000000) {
      yield put(OpenInfoModal({
        title: 'Слишком много данных',
        description: `График не будет отрисован. Размер данных для отрисовки графика составляет ${(result.fileSize/1000000.0).toFixed(2)} MB.`
      }));
    }

    yield put(SetFirstAlgorithmResult(result));
  } catch (e) { }

  yield put(SetFirstAlgorithmLoading(false));
}


function* startStopTimeout(action: ActionWithPayload) {
  if (action.type === ActionTypes.SetFirstAlgorithmResult) {
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
  yield takeLatest([ActionTypes.StartFirstAlgorithm, ActionTypes.StopFirstAlgorithm], startStopCalculation)
  yield takeLatest([ActionTypes.StartFirstAlgorithm, ActionTypes.SetFirstAlgorithmResult], startStopTimeout)
}