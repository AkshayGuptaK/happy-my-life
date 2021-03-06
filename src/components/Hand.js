import React from 'react'

import Card from './Card'

class Hand extends React.Component {
  render () {
    return (
      <div className='hand'>
        {this.props.cards.map(card => <Card key={card.id} onClick={() => this.props.play(card.id)} {...card} />)}
      </div>
    )
  }
}

export default Hand
