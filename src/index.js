import React from 'react'

let Context
let Consumer
let Provider
let withState = (select) => (Component) => (props) => {
  return (
    <Consumer>
      {state => {
        return select
          ? <Component {...props} {...select(state)}/>
          : <Component {...props} {...state}/>
      }}
    </Consumer>
  )
}
let dispatch = () => {
  console.warn('Still no context created')
}

let combineReducers = (reducers) => {
  return function (state, action) {
    let newState = state
    reducers.forEach(
      function (reducer) {
        newState = reducer(newState, action)
      }
    )
    return newState
  }
}

export {
  Context,
  Consumer,
  Provider,
  withState,
  dispatch,
  combineReducers
}

const initContext = (initialState = {}, reducer, middleware = []) => {
  Context = React.createContext({
    ...initialState,
    dispatch: () => {
      console.warn('Please add a Provider to your application first')
    }
  })

  class ProviderElement extends React.Component {
    constructor (props) {
      super(props)

      const dispatcher = (action) => {
        this.setState(
          state => {
            before(state, action, dispatcher)
            const newState = reducer(state, action, dispatcher)
            after(newState, action, dispatcher)
            return newState
          }
        )
      }

      dispatch = dispatcher

      this.state = {
        ...initialState,
        dispatch: dispatcher
      }
    }

    render () {
      return (
        <Context.Provider value={this.state}>
          {this.props.children}
        </Context.Provider>
      )
    }
  }

  const before = (currentState, action, dispatcher) => {
    if (process.env.NODE_ENV === 'development') {
      console.group('Context action:', action.type)
    }
    middleware.forEach(
      middleAction => {
        if (middleAction.before) {
          middleAction.before(currentState, action, dispatcher)
        }
      }
    )
    return currentState
  }

  const after = (afterState, action, dispatcher) => {
    middleware.forEach(
      middleAction => {
        if (middleAction.after) {
          middleAction.after(afterState, action, dispatcher)
        }
      }
    )
    if (process.env.NODE_ENV === 'development') {
      console.groupEnd()
    }
    return afterState
  }

  Consumer = Context.Consumer
  Provider = ProviderElement

  return {
    Context,
    Provider,
    Consumer
  }
}

export default initContext
