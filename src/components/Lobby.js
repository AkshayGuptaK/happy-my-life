import React from 'react'

class Lobby extends React.Component {
  constructor (props) {
    super(props)
    this.state = { selected: null }
  }
  select = (e) => {
    let node = e.target
    this.setState({ 'selected': node.innerHTML }, () => node.className = 'selected')
  }
  render () {
    return (
      <div className='lobby'>
        {this.props.games.map(game => <p className='not' onClick={this.select}>Room {game}</p>)}
        <button onClick={this.props.create}>Create Game</button>
        <button onClick={() => this.props.join(this.state.selected)}>Join Game</button>
      </div>
    )
  }
}

export default Lobby
