import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import initContext from 'recost'
import reducer from './Context/reducer'
import * as logger from './Context/logger'
import * as callAPI from './Context/callAPI'

const initialState = {
  count: 1
}

initContext(initialState, reducer, [
  logger,
  callAPI
])

ReactDOM.render(
  <App/>,
  document.getElementById('root')
)
