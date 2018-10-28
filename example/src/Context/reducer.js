import { SUCCESS_COUNT, COUNT } from './actionTypes'
import { combineReducers } from 'recost'

const reducerOne = (state, action) => {
  if (action.type === SUCCESS_COUNT) {
    return {
      ...state,
      count: state.count + 1
    }
  }

  return state
}

const reducerTwo = (state, action) => {
  if (action.type === COUNT) {
    return {
      ...state,
      count: state.count + 1
    }
  }

  return state
}

export default combineReducers([reducerOne, reducerTwo])