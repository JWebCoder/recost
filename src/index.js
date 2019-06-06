import React from 'react'

let Context
let Consumer
let Provider

// withState higher order component
let withState = (select) => (Component) => (props) => {
  return (
    <Consumer>
      {state => {
        return select
          ? <Component {...props} {...select(state, props)}/>
          : <Component {...props} {...state}/>
      }}
    </Consumer>
  )
}

const actionStack = []

// dispatch, we create this function that will be updated once the context is created
let dispatch = (action) => {
  actionStack.push(action)
  console.warn('Still no context created, action pushed to stack')
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

    componentDidMount () {
      actionStack.forEach(
        (action) => {
          this.setState(
            state => {
              before(state, action, dispatch)
              const newState = reducer(state, action, dispatch)
              after(newState, action, dispatch)
              return newState
            }
          )
        }
      )
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
