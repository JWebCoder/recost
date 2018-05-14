# Recost

React context state management system

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installing

Use **yarn** or **npm** to install the package in your React Application

    yarn add recost

### Usage

Next you need to **initialize the context** with a **reducer** for your application.

#### index.js

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import initContext, { Provider } from 'recost'

// create a reducer function
const reducer = (state, action) => {
  if (action.type === 'COUNT') {
    return {
      ...state,
      count: state.count + 1
    }
  }

  return state
}

// define the initial state for the application
const initialState = {
  count: 1
}

// initialize the context
initContext(initialState, reducer)

ReactDOM.render(
  <Provider> // add the Provider component to your application
    <App/>
  </Provider>,
  document.getElementById('root')
)
```

Now you can use the dispatcher and the state anywhere in the code

#### App.js

```js
import React, { Component } from 'react'
import { dispatch, withState } from 'recost'

let Count = (props) => {
  return <p>{props.count}</p>
}

const mapStateToProps = (state) => ({
  count: state.count
})

Count = withState(mapStateToProps)(Count)

class App extends Component {
  onClickButton() {
    dispatch({
      type: 'COUNT'
    })
  }

  render() {
    return (
      <div>
        <Count/>
        <button onClick={this.onClickButton}>
          Increase
        </button>
      </div>
    )
  }
}

export default App
```

## Using middleware

In this example we have added two middleware functions.

A **logger**, that will run **before** and **after** the state changes logging the changes.

#### logger.js

```js
const before = (state, action) => {
  console.log('State before action:', state)
  console.log('Full action:', action)
}

const after = (state, action) => {
  console.log('State after action:', state)
}

export {
  before,
  after
}
```

And a **callAPI**, that runs **before** each state change.

#### callAPI.js

```js
const before = (state, action, dispatch) => {
  if (action.type === 'COUNT_API') {
    setTimeout( // simulates and api call
      () => {
        dispatch({
          type: 'SUCCESS_COUNT'
        })
      }
      , 1000
    )
  }
}

export {
  before
}
```

Now we just need to add the new middleware to the context

#### index.js

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import initContext, { Provider } from 'recost'
import * as logger from './Context/logger'
import * as callAPI from './Context/callAPI'

// create a reducer function
const reducer = (state, action) => {
  if (action.type === 'COUNT') {
    return {
      ...state,
      count: state.count + 1
    }
  }

  return state
}

// define the initial state for the application
const initialState = {
  count: 1
}

// initialize the context with the middleware
initContext(initialState, reducer, [
  logger,
  callAPI
])

ReactDOM.render(
  <Provider> // add the Provider component to your application
    <App/>
  </Provider>,
  document.getElementById('root')
)
```

## API definition

### initContext

Creates a new application context

```js
import initContext from 'recost'

initContext(initialState, reducer, middleware)
```

| Params       | required | description                                                               |
| ------------ | -------- | ------------------------------------------------------------------------- |
| initialState | yes      | initial application state                                                 |
| reducer      | yes      | function that generates new state based on actions                        |
| middleware   | yes      | Array of middleware that can run before or after the reducer taking place |

#### initialState

Defaults to an empty object `{}`

#### reducer

```js
const reducer = (state, action) => {
  if (action.type === 'COUNT') {
    return {
      ...state,
      count: state.count + 1
    }
  }

  return state
}
```

| Params | description                                     |
| ------ | ----------------------------------------------- |
| state  | current application state                       |
| action | action object passed by the dispatcher function |

#### middleware

Defaults to an empty array `[]`

### dispatch

Dispatches an action that will trigger a state change

```js
import { dispatch } from 'recost'

dispatch(actionObject)
```

| Params       | required | description                                                       |
| ------------ | -------- | ----------------------------------------------------------------- |
| actionObject | yes      | object containing the type of action and the payload if necessary |

#### actionObject

```js
dispatch({
  type: 'COUNT',
  payload: null // this property is only required if we want to pass in some data
})
```

### withState

Composed function that takes a mapStateToProps function and a component

```js
import { withState } from 'recost'

WrappedComponent = withState(mapStateToProps)(Component)
```

| Params          | required | description                                                                                                                 |
| --------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| mapStateToProps | no       | function that receives the full state and return a portion of it, if not defined, the entire state is sent to the component |
| component       | yes      | component to wrap with state                                                                                                |

#### mapStateToProps

```js
const mapStateToProps = (state) => ({
  count: state.count
})
```

#### component

```js
const Count = (props) => {
  return <p>{props.count}</p>
}

const WrappedCount = withState(mapStateToProps)(Count)
```

or

```js
class Count extends React.[PureComponent|Component] {
  render() {
    return <p>{this.props.count}</p>
  }
}

const WrappedCount = withState(mapStateToProps)(Count)
```

### Provider

Provider component, sets where we want to deliver our context

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'recost'

ReactDOM.render(
  <Provider>
    <App/>
  </Provider>,
  document.getElementById('root')
)
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

-   **João Moura** - _Initial work_ - [JWebCoder](https://github.com/JWebCoder)

<!--
See also the list of [contributors](CONTRIBUTORS.md) who participated in this project.
-->

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

-   Inspired by [Statty](https://github.com/vesparny/statty) and [Redux](https://redux.js.org/)
