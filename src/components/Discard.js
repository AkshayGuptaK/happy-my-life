import React from 'react'

import Card from './Card'

class Discard extends React.Component {
  render () {
    return (
      <div className='discard'>
        { this.props.cards.length > 0
          ? <Card {...this.props.cards[this.props.cards.length - 1]} />
          : null }
      </div>
    )
  }
}

export default Discard
