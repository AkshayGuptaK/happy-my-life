import React from 'react'

class Lobby extends React.Component {
  constructor (props) {
    super(props)
    this.state = { selected: null }
  }
  select = (e) => {
    let node = e.target
    this.setState({ 'selected': node.innerHTML })
  }
  getID = (room) => {
    return room ? Number(/Room (\d+)/.exec(room)[1]) : null
  }
  render () {
    return (
      <div className='lobby'>
        {this.props.games.map(game => 
        <p key={game} className={this.getID(this.state.selected) === game ? 'selected' : 'not'} onClick={this.select}>Room {game}</p>)}
        <button onClick={this.props.create}>Create Game</button>
        <button onClick={() => this.props.join(this.state.selected)}>Join Game</button>
      </div>
    )
  }
}

export default Lobby
