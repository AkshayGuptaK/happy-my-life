import React from 'react'
import { hot } from 'react-hot-loader'
// import { Route, Redirect, Switch } from 'react-router-dom'

import '../App.css'
import DraftArray from './DraftArray'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <div>
        <p>A deckbuilding game of mundane proportions</p>
        <DraftArray players={1} />
      </div>
    )
  }
}

export default hot(module)(App)
