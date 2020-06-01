import { FirstAlgorithmParams } from "../models/FirstAlhorithmParams";
import { Point } from "electron";
import { Reducer } from "redux";
import { ActionWithPayload, BrownianMotionResult, SecondAlgorithmParams } from "../models";
import { ActionTypes } from "./Actions";

export interface RootState {
  firstAlgorithmParams: FirstAlgorithmParams;
  firstAlgorithmResult: BrownianMotionResult;
  firstAlgorithmLoading: boolean;
  secondAlgorithmParams: SecondAlgorithmParams;
  secondAlgorithmResult: BrownianMotionResult;
  secondAlgorithmLoading: boolean;
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
  secondAlgorithmParams: {
    HParam: '0.75',
    TettaParam: '10000',
    timeoutSeconds: '600'
  },
  firstAlgorithmResult: {
    points: []
  },
  secondAlgorithmResult: {
    points: []
  },
  firstAlgorithmLoading: false,
  secondAlgorithmLoading: false,
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
    case ActionTypes.SetSecondAlgorithmParams:
      return {
        ...state,
        secondAlgorithmParams: action.payload
      }
    case ActionTypes.SetSecondAlgorithmResult:
      return {
        ...state,
        secondAlgorithmResult: action.payload
      }
    case ActionTypes.SetSecondAlgorithmLoading:
      return {
        ...state,
        secondAlgorithmLoading: action.payload
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