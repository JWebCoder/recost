import { COUNT } from '../utils/actionTypes'

import { IAction, IBaseState } from 'recost'

export interface IStateTwo extends IBaseState {
  count: number,
}

export default function (state: IStateTwo, action: IAction) {
  if (action.type === COUNT) {
    return {
      ...state,
      count: state.count + 1
    }
  }

  return state
}