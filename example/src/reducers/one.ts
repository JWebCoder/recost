import { SUCCESS_COUNT } from '../utils/actionTypes'

import { IAction, IBaseState } from 'recost'

export interface IStateOne extends IBaseState {
  count: number,
}

export default function (state: IStateOne, action: IAction) {
  if (action.type === SUCCESS_COUNT) {
    return {
      ...state,
      count: state.count + 1
    }
  }

  return state
}