import { FirstAlgorithmParams, Point } from '../models';

export enum ActionTypes {
  InitStore = 'InitStore',
  SetFirstAlgorithmParams = 'SetFirstAlgorithmParams',
  SetFirstAlgorithmResult = 'SetFirstAlgorithmResult',
  StartFirstAlgorithm = 'StartFirstAlgorithm',
  StopFirstAlgorithm = 'StopFirstAlgorithm',
  SetFirstAlgorithmLoading = 'SetFirstAlgorithmLoading',
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

export const SetFirstAlgorithmResult = (payload: Array<Point>) => ({
  type: ActionTypes.SetFirstAlgorithmResult,
  payload: payload
})
