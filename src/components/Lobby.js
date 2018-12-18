import React from 'react'

class Lobby extends React.Component {
  render () {
    return (
      <div>
        {this.props.games.map(game => <p>Room {game}</p>)}
        <button onClick={this.props.create}>Create Game</button>
        <button>Join Game</button>
      </div>
    )
  }
}

export default Lobby
