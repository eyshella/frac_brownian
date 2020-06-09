import { FirstAlgorithmParams } from "../models/FirstAlgorithmParams";
import { Point } from "electron";
import { Reducer } from "redux";
import { ActionWithPayload, StochasticProcessData, SecondAlgorithmParams } from "../models";
import { ActionTypes } from "./Actions";

export interface RootState {
  firstAlgorithmParams: FirstAlgorithmParams;
  firstAlgorithmResult: StochasticProcessData;
  firstAlgorithmLoading: boolean;
  secondAlgorithmParams: SecondAlgorithmParams;
  secondAlgorithmResult: StochasticProcessData;
  secondAlgorithmLoading: boolean;
  isInfoModalOpen: boolean;
  infoModalTitle: string;
  infoModalDescription: string;
}

const defaultState: RootState = {
  firstAlgorithmParams: {
    HParam: '0.5',
    MParam: '250',
    TParam: '250',
    mParam: '15',
    numberOfPaths: '100',
    timeoutSeconds: '300',
    ParamsT:'50'
  },
  secondAlgorithmParams: {
    HParam: '0.75',
    TettaParam: '1000',
    timeoutSeconds: '300',
    numberOfPaths: '100',
    ParamsT:'50',
  },
  firstAlgorithmResult: {
    paths: [],
  },
  secondAlgorithmResult: {
    paths: [],
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