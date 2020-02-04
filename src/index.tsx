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

type Reducer = (state: any, action: IAction, dispatcher: Dispatcher) => any;

export default function<State extends IBaseState>(
  initialState: State,
  reducers: Array<Reducer>,
  middlewares: Array<{
    before?: (state: State, action: IAction, dispatcher?: Dispatcher) => void,
    after?: (state: State, action: IAction, dispatcher?: Dispatcher) => void,
  }> = [],
) {
  let dispatcher: Dispatcher = (action) => {
    actionStack.push(action)
  }

  type MergedReducer = (state: State, action: IAction, dispatcher?: Dispatcher) => State
  type Selector<PartialState> = (state: State, props?: Props<any>) => PartialState;

  const actionStack: Array<IAction> = []
  
  const reducer: MergedReducer = (state, action, dispatch) => (
    reducers.reduce((newState, r) => (r(newState, action, dispatch) as State), state)
  )
  
  const dispatch: Dispatcher = (action) => dispatcher(action)
  
  const Context = React.createContext<State>({
    ...initialState,
    dispatch: (action: IAction) => {
      console.warn('Please add a Provider to your application first')
    }
  })
  
  const Consumer = Context.Consumer

  const useSelector = function<PartialState>(select: Selector<PartialState>) {
    return select(React.useContext(Context))
  }
  
  const withState = function<PartialState>(select: Selector<PartialState>){
    return (Comp: ComponentType<any>) => (props: Props<any>) => (
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
    state = {
      ...initialState,
      dispatcher: (action: IAction) => this.setState((state) => {
        runMiddlewares('before', state, action, dispatch)
        const newState = reducer(state, action, dispatch)
        runMiddlewares('after', newState, action, dispatch)
        return newState
      })
    }
    componentDidMount() {
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
