import React from 'react'

import Card from './Card'

class DraftArray extends React.Component {
  render () {
    return (
      <div className='draftArray'>
        <Card {...this.props.cards[0]} />
        <Card {...this.props.cards[1]} />
        <Card {...this.props.cards[2]} />
        <Card {...this.props.cards[3]} />
      </div>
    )
  }
}

export default DraftArray
