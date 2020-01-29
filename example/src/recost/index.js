import recost from 'recost'
import reducer from './reducer'
import * as logger from './logger'
import * as callAPI from './callAPI'

const initialState = {
  count: 1
}

const middlewares = [
  logger,
  callAPI
]

const { dispatch, withState, useSelector, Provider, combineReducers } = recost(initialState, reducer, middlewares)

export {
  withState,
  useSelector,
  Provider,
  dispatch,
  combineReducers,
}