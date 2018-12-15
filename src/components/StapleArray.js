import React from 'react'

import CardStackArray from './CardStackArray'
import cardList from '../cardList'

class StapleArray extends React.Component {
  render () {
    return (
      <CardStackArray class='stapleArray' stacks={
        [{ 'count': this.props.counts[0], 'onClick': () => this.props.draft(0), ...cardList['banana'] },
          { 'count': this.props.counts[1], 'onClick': () => this.props.draft(1), ...cardList['waterbottle'] },
          { 'count': this.props.counts[2], 'onClick': () => this.props.draft(2), ...cardList['raincheck'] },
          { 'count': this.props.counts[3], 'onClick': () => this.props.draft(3), ...cardList['sadmemory'] }
        ]} />
    )
  }
}

export default StapleArray
