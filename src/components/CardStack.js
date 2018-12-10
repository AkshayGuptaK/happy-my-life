import React from 'react'

import Card from './Card'

class CardStack extends React.Component {
  render () {
    return (
      <div>
        {this.props.count > 0
          ? <Card />
          : null
        }
      </div>
    )
  }
}

export default CardStack
