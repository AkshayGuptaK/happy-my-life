import React from 'react'

import Card from './Card'

class Hand extends React.Component {
  render () {
    return (
      <div className='hand'>
        {this.props.cards.map(card => <Card {...card} />)}
      </div>
    )
  }
}

export default Hand
