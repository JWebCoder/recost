import recost, { IBaseState } from 'recost'
import * as logger from '../utils/logger'
import * as callAPI from '../utils/callAPI'

import reducerOne, { IStateOne } from './one'
import reducerTwo, { IStateTwo } from './two'

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

export interface IState extends IStateOne, IStateTwo {} 

const { 
  dispatch,
  withState,
  useSelector,
  Provider,
} = recost<IState>(initialState, reducers, middlewares)

export {
  withState,
  useSelector,
  Provider,
  dispatch,
}