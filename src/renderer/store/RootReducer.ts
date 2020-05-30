import { FirstAlgorithmParams } from "../models/FirstAlhorithmParams";
import { Point } from "electron";
import { Reducer } from "redux";
import { ActionWithPayload, BrownianMotionResult } from "../models";
import { ActionTypes } from "./Actions";

export interface RootState {
  firstAlgorithmParams: FirstAlgorithmParams;
  firstAlgorithmResult: BrownianMotionResult;
  firstAlgorithmLoading: boolean;
  isInfoModalOpen: boolean;
  infoModalTitle: string;
  infoModalDescription: string;
}

const defaultState: RootState = {
  firstAlgorithmParams: {
    HParam: '0.5',
    MParam: '500',
    TParam: '500',
    mParam: '30',
    timeoutSeconds: '600'
  },
  firstAlgorithmResult: {
    points: []
  },
  firstAlgorithmLoading: false,
  isInfoModalOpen: false,
  infoModalTitle: '',
  infoModalDescription: '',
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
    case ActionTypes.OpenInfoModal:
      return {
        ...state,
        isInfoModalOpen: true,
        infoModalTitle: action.payload.title,
        infoModalDescription: action.payload.description
      }
    case ActionTypes.CloseInfoModal:
      return {
        ...state,
        isInfoModalOpen: false,
        infoModalTitle: '',
        infoModalDescription: ''
      }
    default:
      return state
  }
}