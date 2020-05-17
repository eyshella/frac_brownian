import { AnyAction } from 'redux';

export interface ActionWithPayload<T=any> extends AnyAction {
  payload?: T
}