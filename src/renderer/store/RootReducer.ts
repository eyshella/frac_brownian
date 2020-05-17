import { FirstAlgorithmParams } from "../models/FirstAlhorithmParams";
import { Point } from "electron";
import { Reducer } from "redux";
import { ActionWithPayload } from "../models";
import { ActionTypes } from "./Actions";

export interface RootState {
  firstAlgorithmParams: FirstAlgorithmParams;
  firstAlgorithmResult: Array<Point>;
  firstAlgorithmLoading: boolean
}

const defaultState: RootState = {
  firstAlgorithmParams: {
    HParam: '0.5',
    MParam: '500',
    TParam: '500',
    mParam: '30',
    timeoutSeconds: '600'
  },
  firstAlgorithmResult: [],
  firstAlgorithmLoading: false
}

export const RootReducer: Reducer<RootState, ActionWithPayload> = (state: RootState | undefined, action: ActionWithPayload) => {
  if (state == null) {
    return defaultState
  }

  switch (action.type) {
    case ActionTypes.SetFirstAlgorithmParams:
      return {
        ...state,
        firstAlgorithmParams: action.payload
      }
    case ActionTypes.SetFirstAlgorithmResult:
      return {
        ...state,
        firstAlgorithmResult: action.payload
      }
    case ActionTypes.SetFirstAlgorithmLoading:
      return {
        ...state,
        firstAlgorithmLoading: action.payload
      }
    default:
      return state
  }
}