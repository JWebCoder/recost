import React, { Props, ReactElement, ComponentType, useEffect, useState } from 'react'

export type Dispatcher = (action: IAction) => void
export interface IAction {
  type: string;
  payload: any;
  [key: string]: any;
}
export interface IBaseState {
  dispatch: Dispatcher;
}

export default function<State>(
  initialState: State,
  middlewares: Array<{
    before: (state: State, action: IAction, dispatcher?: Dispatcher) => void,
    after: (state: State, action: IAction, dispatcher?: Dispatcher) => void,
  }> = [],
) {
  
  type Reducer = (state: State, action: IAction, dispatcher?: Dispatcher) => State
  type Selector = (state: State, props?: Props<any>) => Partial<State>;

  const actionStack: Array<IAction> = []
  let reducer: Reducer
  let dispatch: Dispatcher = (action) => actionStack.push(action)

  const combineReducers = (reducers: Reducer[]) => {
    reducer = (state, action, dispatch) => reducers.reduce((newState, r) => r(newState, action, dispatch), state)
  }

  const Context = React.createContext<State>({
    ...initialState,
    dispatch: (action: IAction) => {
      console.warn('Please add a Provider to your application first')
    }
  })
  const Consumer = Context.Consumer

  const useSelector = (select: Selector) => select(React.useContext(Context))
  
  const withState = (select: Selector) => (Comp: ComponentType<any>) => (props: Props<any>) => {
    return (
      <Consumer>
        {(state: State) => (
          <Comp {...props} {...(select ? select(state, props) : {})} />
        )}
      </Consumer>
    )
  }

  const runMiddlewares = (name: 'before' | 'after', state: State, action: IAction, dispatcher: Dispatcher) => {
    middlewares.forEach((middleware) => middleware[name] && middleware[name](state, action, dispatcher))
    return state
  }

  const Provider: React.FC<{ children: ReactElement }> = ({ children }) => {

    const [state, setState] = useState<State>(initialState)
    
    dispatch = (action: IAction) => setState((state) => {
      runMiddlewares('before', state, action, dispatch)
      const newState = reducer(state, action, dispatch)
      runMiddlewares('after', newState, action, dispatch)
      return newState
    })
    
    useEffect(() => {
      setState((state) => ({ ...state, dispatch }))
      actionStack.forEach(dispatch)
    }, [])
    
    return (
      <Context.Provider value={state}>
        {children}
      </Context.Provider>
    )
  }
  return { Provider, withState, useSelector, dispatch, combineReducers }
}
