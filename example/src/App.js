import React, { Component, PureComponent } from 'react'
import logo from './logo.svg'
import './App.css'
import { dispatch, Provider, withState } from './reducers'

class Count extends PureComponent {
  render() {
    return <p>{this.props.count}</p>
  }
}

const mapStateToProps = (state) => ({
  count: state.count
})

Count = withState(mapStateToProps)(Count)

class App extends Component {
  onClickButtonAPI() {
    dispatch({
      type: 'COUNT_API'
    })
  }
  onClickButton() {
    dispatch({
      type: 'COUNT'
    })
  }

  render() {
    return (
      <div className="App">
        <div className="withProvider">
          <Provider>
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Content inside provider</h1>
            </header>
            <Count/>
            <button onClick={this.onClickButtonAPI}>
              Increase - Simulate API
            </button>
          </Provider>
        </div>
        <p className="App-intro">
          Content outside the provider
        </p>
        <button onClick={this.onClickButton}>
          Increase - Outside provider
        </button>
      </div>
    )
  }
}

export default App;
