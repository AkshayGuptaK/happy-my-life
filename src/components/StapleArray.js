import React from 'react'

import CardStackArray from './CardStackArray'
import cardList from '../cardList'

class StapleArray extends React.Component {
  render () {
    return (
      <CardStackArray class='stapleArray' stacks={
        [{ 'count': this.props.counts[0], 'onClick': (e) => this.props.draft(e, 0), ...cardList['banana'] },
          { 'count': this.props.counts[1], 'onClick': (e) => this.props.draft(e, 1), ...cardList['waterbottle'] },
          { 'count': this.props.counts[2], 'onClick': (e) => this.props.draft(e, 2), ...cardList['raincheck'] },
          { 'count': this.props.counts[3], 'onClick': (e) => this.props.draft(e, 3), ...cardList['sadmemory'] }
        ]} />
    )
  }
}

export default StapleArray
