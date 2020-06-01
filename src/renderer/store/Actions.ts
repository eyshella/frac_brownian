import { FirstAlgorithmParams, Point, BrownianMotionResult, SecondAlgorithmParams } from '../models';

export enum ActionTypes {
  InitStore = 'InitStore',
  SetFirstAlgorithmParams = 'SetFirstAlgorithmParams',
  SetFirstAlgorithmResult = 'SetFirstAlgorithmResult',
  StartFirstAlgorithm = 'StartFirstAlgorithm',
  StopFirstAlgorithm = 'StopFirstAlgorithm',
  SetFirstAlgorithmLoading = 'SetFirstAlgorithmLoading',
  SetSecondAlgorithmParams = 'SetSecondAlgorithmParams',
  SetSecondAlgorithmResult = 'SetSecondAlgorithmResult',
  StartSecondAlgorithm = 'StartSecondAlgorithm',
  StopSecondAlgorithm = 'StopSecondAlgorithm',
  SetSecondAlgorithmLoading = 'SetSecondAlgorithmLoading',
  OpenInfoModal = 'OpenInfoModal',
  CloseInfoModal = 'CloseInfoModal'
}

export interface OpenInfoModalPayload {
  title: string,
  description: string
}

export const OpenInfoModal = (payload: OpenInfoModalPayload) => ({
  type: ActionTypes.OpenInfoModal,
  payload: payload
})

export const CloseInfoModal = () => ({
  type: ActionTypes.CloseInfoModal
})

export const InitStore = () => ({
  type: ActionTypes.InitStore
})

export const StartFirstAlgorithm = () => ({
  type: ActionTypes.StartFirstAlgorithm
})

export const StopFirstAlgorithm = () => ({
  type: ActionTypes.StopFirstAlgorithm
})

export const SetFirstAlgorithmLoading = (payload: boolean) => ({
  type: ActionTypes.SetFirstAlgorithmLoading,
  payload: payload
})

export const SetFirstAlgorithmParams = (payload: FirstAlgorithmParams) => ({
  type: ActionTypes.SetFirstAlgorithmParams,
  payload: payload
})

export const SetFirstAlgorithmResult = (payload: BrownianMotionResult) => ({
  type: ActionTypes.SetFirstAlgorithmResult,
  payload: payload
})

export const StartSecondAlgorithm = () => ({
  type: ActionTypes.StartSecondAlgorithm
})

export const StopSecondAlgorithm = () => ({
  type: ActionTypes.StopSecondAlgorithm
})

export const SetSecondAlgorithmLoading = (payload: boolean) => ({
  type: ActionTypes.SetSecondAlgorithmLoading,
  payload: payload
})

export const SetSecondAlgorithmParams = (payload: SecondAlgorithmParams) => ({
  type: ActionTypes.SetSecondAlgorithmParams,
  payload: payload
})

export const SetSecondAlgorithmResult = (payload: BrownianMotionResult) => ({
  type: ActionTypes.SetSecondAlgorithmResult,
  payload: payload
})
