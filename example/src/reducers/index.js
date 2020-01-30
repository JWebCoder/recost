import recost from 'recost'
import * as logger from '../utils/logger'
import * as callAPI from '../utils/callAPI'

import reducerOne from './one'
import reducerTwo from './two'

const initialState = {
  count: 1
}

const reducers = [
  reducerOne,
  reducerTwo,
]

const middlewares = [
  logger,
  callAPI
]

const { 
  dispatch,
  withState,
  useSelector,
  Provider,
} = recost(initialState, reducers, middlewares)

export {
  withState,
  useSelector,
  Provider,
  dispatch,
}