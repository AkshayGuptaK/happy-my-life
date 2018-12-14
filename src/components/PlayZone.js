import React from 'react'

import Card from './Card'

class PlayZone extends React.Component {
  render () {
    return (
      <div className='play'>
        <div className='friendZone'>
          {this.props.cards.filter(card => /^Friend/.test(card.type)).map(card => <Card key={card.id} {...card} />)}
        </div>
        <div className='foodZone'>
          {this.props.cards.filter(card => /Consumable/.test(card.type)).map(card => <Card key={card.id} {...card} />)}
        </div>
        <div className='actionZone'>
          {this.props.cards.filter(card => /Action/.test(card.type)).map(card => <Card key={card.id} {...card} />)}
        </div>
      </div>
    )
  }
}

export default PlayZone
