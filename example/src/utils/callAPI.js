import { COUNT_API, SUCCESS_COUNT } from './actionTypes'

const before = (state, action, dispatch) => {
  if (action.type === COUNT_API) {
    setTimeout(
      () => {
        dispatch({
          type: SUCCESS_COUNT
        })
      }
      , 1000
    )
  }
}

export {
  before
}
