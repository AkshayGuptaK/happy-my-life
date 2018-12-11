import React from 'react'

import CardStackArray from './CardStackArray'

class DraftArray extends React.Component {
  render () {
    return (
      <CardStackArray class='draftArray' stacks={
        [{ 'count': 5, 'name': 'Banana', 'type': 'Staple-Consumable', 'text': 'Gain 1 Energy', 'energy': 0, 'happiness': 1, 'texture': 'banana' },
          { 'count': 5, 'name': 'Water Bottle', 'type': 'Staple-Consumable', 'text': 'Splash!', 'energy': 0, 'happiness': 1, 'texture': 'water' },
          { 'count': 5, 'name': 'Rain Check', 'type': 'Staple-Consumable', 'text': 'Draft a card and draw a card', 'energy': 0, 'happiness': 0, 'texture': 'raincheck' },
          { 'count': 5, 'name': 'Sad Memory', 'type': 'Staple-Memory', 'text': 'Discard at end of turn', 'energy': 0, 'happiness': -1, 'texture': 'sad' }
        ]} />
    )
  }
}

export default DraftArray
