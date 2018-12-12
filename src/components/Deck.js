import React from 'react'

class Deck extends React.Component {
  render () {
    return (
      <div className='deck' onClick={this.props.onClick} >
        { this.props.cards.length > 0
          ? <div className='cardBack' />
          : null }
      </div>
    )
  }
}

export default Deck
