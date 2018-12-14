import React from 'react'

import Card from './Card'

class DraftArray extends React.Component {
  render () {
    return (
      <div className='draftArray'>
        { this.props.cards.length > 0
          ? <div>
            <Card {...this.props.cards[0]} onClick={(e) => this.props.draft(e, 0)} />
            <Card {...this.props.cards[1]} onClick={(e) => this.props.draft(e, 1)} />
            <Card {...this.props.cards[2]} onClick={(e) => this.props.draft(e, 2)} />
            <Card {...this.props.cards[3]} onClick={(e) => this.props.draft(e, 3)} />
          </div>
          : null
        }
      </div>
    )
  }
}

export default DraftArray
