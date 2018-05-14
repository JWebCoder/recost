import { SUCCESS_COUNT, COUNT } from './actionTypes'

export default (state, action) => {
  if (action.type === SUCCESS_COUNT || action.type === COUNT) {
    return {
      ...state,
      count: state.count + 1
    }
  }

  return state
}
