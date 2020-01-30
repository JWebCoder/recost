import { SUCCESS_COUNT } from '../utils/actionTypes'

export default function (state, action) {
  if (action.type === SUCCESS_COUNT) {
    return {
      ...state,
      count: state.count + 1
    }
  }

  return state
}