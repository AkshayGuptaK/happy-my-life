import React from 'react'
import { hot } from 'react-hot-loader'
import io from 'socket.io-client'

import '../App.css'
import Board from './Board'

class App extends React.Component {
  constructor (props) {
    super(props)
    var socket = io.connect('http://localhost:8000')
    socket.on('connect', () => console.log('Connected'))
  }
  render () {
    return (
      <Board />
    )
  }
}

export default hot(module)(App)
