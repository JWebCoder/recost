import React, { Props, ReactElement, ComponentType, Component } from 'react'

export interface IAction {
  type: string;
  payload?: any;
  [key: string]: any;
}
export type Dispatcher = (action: IAction) => void
export interface IBaseState {
  dispatch?: Dispatcher;
}
export interface IProviderProps {
  children: ReactElement | ReactElement[];
}

export default function<State extends IBaseState>(
  initialState: State,
  reducers: Array<(state: State, action: IAction, dispatcher?: Dispatcher) => State>,
  middlewares: Array<{
    before?: (state: State, action: IAction, dispatcher?: Dispatcher) => void,
    after?: (state: State, action: IAction, dispatcher?: Dispatcher) => void,
  }> = [],
) {
  let dispatcher: Dispatcher = (action) => {
    actionStack.push(action)
  }

  type Reducer = (state: State, action: IAction, dispatcher?: Dispatcher) => State
  type Selector = (state: State, props?: Props<any>) => Partial<State>;

  const actionStack: Array<IAction> = []
  
  const reducer: Reducer = (state, action, dispatch) => (
    reducers.reduce((newState, r) => r(newState, action, dispatch), state)
  )
  
  const dispatch: Dispatcher = (action) => dispatcher(action)
  
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
    middlewares.forEach((middleware) => {
      const run = middleware[name]
      run && run(state, action, dispatcher)
    })
    return state
  }

  const Provider = class extends Component<IProviderProps, State> {
    componentDidMount() {
      dispatcher = (action: IAction) => this.setState((state) => {
        runMiddlewares('before', state, action, dispatch)
        const newState = reducer(state, action, dispatch)
        runMiddlewares('after', newState, action, dispatch)
        return newState
      })
      actionStack.forEach(dispatch) 
    }
    render() {
      return (
        <Context.Provider value={this.state}>
          {this.props.children}
        </Context.Provider>
      )
    }
  }
  return { Provider, withState, useSelector, dispatch }
}
