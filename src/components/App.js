import React from 'react'
import { hot } from 'react-hot-loader'
import io from 'socket.io-client'

import '../App.css'
import Lobby from './Lobby'
import Board from './Board'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = { games: [], in_game: false }
    this.socket = io.connect('http://localhost:8000')
    this.socket.on('connect', () => console.log('connected'))
    this.socket.on('gameCreated', this.createGame)
  }
  createGame = (id) => {
    this.setState({ 'games': this.state.games.concat([id]), 'in_game': true })
  }

  render () {
    return (
      <div>
        {this.state.in_game
        ? <Board />
        : <Lobby create={() => this.socket.emit('newGame')} games={this.state.games}/>
        }
      </div>
    )
  }
}

export default hot(module)(App)
