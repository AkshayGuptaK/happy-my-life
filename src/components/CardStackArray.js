import React from 'react'

import CardStack from './CardStack'

class CardStackArray extends React.Component {
  render () {
    return (
      <div className={this.props.class}>
        {this.props.stacks.map(stack => <CardStack key={stack.name} {...stack} />)}
      </div>
    )
  }
}

export default CardStackArray
