import React from 'react'

import Card from './Card'

class PlayZone extends React.Component {
  render () {
    console.log(this.props.cards)
    return (
      <div>
        <div>
          {this.props.cards.filter(card => /^Friend/.test(card.type)).map(card => <Card key={card.id} {...card} />)}
        </div>
        <div>
          {this.props.cards.filter(card => /Consumable/.test(card.type)).map(card => <Card key={card.id} {...card} />)}
        </div>
        <div>
          {this.props.cards.filter(card => /Action/.test(card.type)).map(card => <Card key={card.id} {...card} />)}
        </div>
      </div>
    )
  }
}

export default PlayZone
