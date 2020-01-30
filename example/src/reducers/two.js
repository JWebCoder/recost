import { COUNT } from '../utils/actionTypes'

export default function (state, action) {
  if (action.type === COUNT) {
    return {
      ...state,
      count: state.count + 1
    }
  }

  return state
}