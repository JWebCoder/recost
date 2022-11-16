import React, { useCallback } from 'react';
import './App.css';

import { dispatch, Provider } from './reducers'

import Count from './Count'

function App() {
  
  const onClickButtonAPI = useCallback(() => {
    dispatch({ type: 'COUNT_API' })
  }, [])
  
  const onClickButton = useCallback(() => {
    dispatch({ type: 'COUNT' })
  }, [])

  return (
    <div className="App">
      <div className="withProvider">
          <Provider>
            <header className="App-header">
              <h1 className="App-title">Content inside provider</h1>
            </header>
            <Count/>
            <button onClick={onClickButtonAPI}>
              Increase - Simulate API
            </button>
          </Provider>
        </div>
        <p className="App-intro">
          Content outside the provider
        </p>
        <button onClick={onClickButton}>
          Increase - Outside provider
        </button>
    </div>
  );
}

export default App;
