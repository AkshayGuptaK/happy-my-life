import React from 'react'
import { hot } from 'react-hot-loader'
// import { Route, Redirect, Switch } from 'react-router-dom'

import '../App.css'
import Hand from './Hand'
import Deck from './Deck'
import Discard from './Discard'
import RewardArray from './RewardArray'
import StapleArray from './StapleArray'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <div>
        <div>
          <StapleArray players={1} />
          <RewardArray players={1} />
        </div>
        <div>
          <Hand />
          <Deck />
          <Discard />
        </div>
      </div>
    )
  }
}

export default hot(module)(App)
