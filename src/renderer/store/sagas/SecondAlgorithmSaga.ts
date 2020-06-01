import { ipcRenderer } from 'electron';
import { call, delay, put, select, takeLatest } from 'redux-saga/effects';

import { ActionWithPayload, SecondAlgorithmParams, Point, BrownianMotionResult } from '../../models';
import { ActionTypes, SetSecondAlgorithmLoading, SetSecondAlgorithmResult, StopSecondAlgorithm, OpenInfoModal } from '../Actions';
import { RootState } from '../RootReducer';
import { firstAlgorithmParamsSelector, secondAlgorithmParamsSelector } from '../Selectors';
import { IpcEvents } from '../../../models';


function* startStopCalculation(action: ActionWithPayload) {
  if (action.type === ActionTypes.StopSecondAlgorithm) {
    yield put(SetSecondAlgorithmLoading(false));
    ipcRenderer.send(IpcEvents.StopSecondAlgorithm);
    return;
  }

  yield put(SetSecondAlgorithmLoading(true));

  const state: RootState = yield select();
  const params: SecondAlgorithmParams = secondAlgorithmParamsSelector(state);
  const H = +params.HParam;
  const Tetta = +params.TettaParam;

  const runCalculationPromise = new Promise((resolve, reject) => {
    ipcRenderer.once(IpcEvents.ResponseSecondAlgorithm, (event: any, result: BrownianMotionResult | null) => {
      if (result == null) {
        reject();
      }
      resolve(result);
    })
    ipcRenderer.send(IpcEvents.StartSecondAlgorithm, H, Tetta);
  })

  try {
    const result: BrownianMotionResult = yield call(() => runCalculationPromise);

    if (result.fileSize != null && result.fileSize > 20000000) {
      yield put(OpenInfoModal({
        title: 'Слишком много данных',
        description: `График не будет отрисован. Размер данных для отрисовки графика составляет ${(result.fileSize/1000000.0).toFixed(2)} MB.`
      }));
    }

    yield put(SetSecondAlgorithmResult(result));
  } catch (e) { }

  yield put(SetSecondAlgorithmLoading(false));
}


function* startStopTimeout(action: ActionWithPayload) {
  if (action.type === ActionTypes.SetSecondAlgorithmResult) {
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
  yield takeLatest([ActionTypes.StartSecondAlgorithm, ActionTypes.StopSecondAlgorithm], startStopCalculation)
  yield takeLatest([ActionTypes.StartSecondAlgorithm, ActionTypes.SetSecondAlgorithmResult], startStopTimeout)
}