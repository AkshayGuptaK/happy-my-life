import React from 'react'

import Card from './Card'

class CardStack extends React.Component {
  render () {
    return (
      <div className='cardStack'>
        {this.props.count > 0
          ? <Card {...this.props} />
          : null
        }
      </div>
    )
  }
}

export default CardStack
