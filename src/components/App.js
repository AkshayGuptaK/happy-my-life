import React from 'react'
import { hot } from 'react-hot-loader'
// import { Route, Redirect, Switch } from 'react-router-dom'

import '../App.css'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <p>A deckbuilding game of mundane proportions</p>
    )
  }
}

export default hot(module)(App)
