import React from 'react'
import { hot } from 'react-hot-loader'
import io from 'socket.io-client'

import '../App.css'
import Lobby from './Lobby'
import GameLogic from './Game'
import SoloGame from './SoloGame'
import CoopGame from './CoopGame'

class App extends React.Component {
  constructor () {
    super()
    this.state = { games: [], inGame: null, gameType: null }
  }
  componentDidMount () {
    this.socket = io.connect('http://localhost:8000')
    this.socket.on('connect', () => console.log('connected'))
    this.socket.on('gamesList', gameIds => this.setState({ games: gameIds }))
    this.socket.on('joinGame', this.onJoin)
    this.socket.on('newGame', id => this.setState({ 'games': this.state.games.concat([id]) }))
    this.socket.on('rejectJoin', () => alert('Sorry, you cannot join this game'))
  }
  requestJoin = (selected) => {
    selected ? this.socket.emit('joinGame', selected) : alert('Please select a game')
  }
  onJoin = (id) => {
    this.Cooperative = GameLogic(CoopGame, { socket: this.socket, id: id, quit: this.returnLobby })
    this.setState({ 'inGame': id })
  }
  returnLobby = () => {
    this.socket.emit('leave', this.state.inGame)
    this.setState({ 'inGame': null, 'gameType': null })
  }
  render () {
    return (
      <div>
        {this.state.inGame
          ? <this.Cooperative />
          : <Lobby create={() => this.socket.emit('newGame')} join={this.requestJoin} games={this.state.games}/>
        }
      </div>
    )
  }
}

export default hot(module)(App)
