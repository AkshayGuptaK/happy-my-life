import React from 'react'

import CardStackArray from './CardStackArray'
import cardList from '../cardList'

class RewardArray extends React.Component {
  render () {
    return (
      <CardStackArray class='rewardArray' stacks={
        [{ 'count': this.props.counts[0], 'onClick': (e) => this.props.buy(e, 0), ...cardList['boxofsweets'] },
          { 'count': this.props.counts[1], 'onClick': (e) => this.props.buy(e, 1), ...cardList['blueberrypie'] },
          { 'count': this.props.counts[2], 'onClick': (e) => this.props.buy(e, 2), ...cardList['goodtime'] },
          { 'count': this.props.counts[3], 'onClick': (e) => this.props.buy(e, 3), ...cardList['happymemory'] }
        ]} />
    )
  }
}

export default RewardArray
