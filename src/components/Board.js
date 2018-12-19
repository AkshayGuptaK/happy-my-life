import React from 'react'

import Counter from './Counter'
import Hand from './Hand'
import Deck from './Deck'
import Discard from './Discard'
import DraftArray from './DraftArray'
import RewardArray from './RewardArray'
import StapleArray from './StapleArray'
import PlayZone from './PlayZone'
import TurnPanel from './TurnPanel'

class Board extends React.Component {
  render () {
    return (
      <div className='board'>
        { this.props.turn > 0
          ? null
          : <button onClick={this.props.start}>Start Game</button>
        }
        { this.props.step === 2 | this.props.step === 3
          ? <button onClick={this.props.nextStep}>Continue</button>
          : null
        }
        <TurnPanel turn={this.props.turn} step={this.props.step} />
        <div className='draftPot'>
          <DraftArray cards={this.props.draftStack} draft={this.props.draft} />
          <StapleArray counts={this.props.stapleArray} draft={this.props.draftStaple} />
          <RewardArray counts={this.props.rewardArray} buy={this.props.buyReward} />
        </div>
        <PlayZone cards={this.props.play} />
        <div className='playerPanel'>
          <Counter {...this.props.player} />
          <Hand cards={this.props.hand} play={this.props.playCard} />
          <Deck cards={this.props.deck} />
          <Discard cards={this.props.discard} />
        </div>
      </div>
    )
  }
}

export default Board
