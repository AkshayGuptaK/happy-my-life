import React from 'react'

import CardStackArray from './CardStackArray'
import cardList from '../cardList'

class RewardArray extends React.Component {
  render () {
    return (
      <CardStackArray class='rewardArray' stacks={
        [{ 'count': this.props.counts[0], 'name': 'Food for Thought', 'type': 'Reward-Consumable', 'text': 'Gain 1 Energy or draw a card', 'energy': 0, 'happiness': 1, 'texture': 'reward' },
          { 'count': this.props.counts[1], 'name': 'Blueberry Pie', 'type': 'Reward-Consumable', 'text': 'Gain 2 Energy', 'energy': 0, 'happiness': 2, 'texture': 'reward' },
          { 'count': this.props.counts[2], 'name': 'A Good Time', 'type': 'Reward-Memory', 'text': '', 'energy': 0, 'happiness': 5, 'texture': 'reward' },
          { 'count': this.props.counts[3], 'name': 'Happy Memory', 'type': 'Reward-Memory', 'text': '', 'energy': 0, 'happiness': 8, 'texture': 'reward' }
        ]} />
    )
  }
}

export default RewardArray
