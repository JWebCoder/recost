import React, { PureComponent } from 'react'
import { withState } from './reducers'

export interface ICountProps {
  count: number,
}

class Count extends PureComponent<ICountProps> {
  render() {
    return <p>{this.props.count}</p>
  }
}

export default withState((state) => {
  return {
    count: state.count,
  }
})(Count)