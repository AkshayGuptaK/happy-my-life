import React from 'react'

import CardStackArray from './CardStackArray'
import cardList from '../cardList'

class RewardArray extends React.Component {
  render () {
    return (
      <CardStackArray class='rewardArray' stacks={
        [{ 'count': this.props.counts[0], 'onClick': () => this.props.buy(0), ...cardList['boxofsweets'] },
          { 'count': this.props.counts[1], 'onClick': () => this.props.buy(1), ...cardList['blueberrypie'] },
          { 'count': this.props.counts[2], 'onClick': () => this.props.buy(2), ...cardList['goodtime'] },
          { 'count': this.props.counts[3], 'onClick': () => this.props.buy(3), ...cardList['happymemory'] }
        ]} />
    )
  }
}

export default RewardArray
