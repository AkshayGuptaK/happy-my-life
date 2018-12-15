import React from 'react'

import Card from './Card'

class DraftArray extends React.Component {
  render () {
    return (
      <div className='draftArray'>
        { this.props.cards.length > 0
          ? <div>
            <Card {...this.props.cards[0]} onClick={() => this.props.draft(0)} />
            <Card {...this.props.cards[1]} onClick={() => this.props.draft(1)} />
            <Card {...this.props.cards[2]} onClick={() => this.props.draft(2)} />
            <Card {...this.props.cards[3]} onClick={() => this.props.draft(3)} />
          </div>
          : null
        }
      </div>
    )
  }
}

export default DraftArray
