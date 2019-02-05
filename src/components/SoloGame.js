import React from 'react'

import Board from './Board'
import gameFunctions from '../gameFunctions'
import generate from '../generateCards'

class SoloGame extends React.Component {
  constructor () {
    super()
    this.maxTurns = 15
  }
  startGame = () => {
    this.props.start(gameFunctions.shuffle(generate.draftDeck()), generate.stapleArray(1), generate.rewardArray(1), this.nextStep)
  }
  nextStep = () => {
    if (this.props.step === 5) {
      if (this.props.turn === this.maxTurns) {
        this.props.end(this.props.player.happiness)
      } else this.nextTurn()
    } else this.props.next(this.props.step + 1, this.nextStep)
  }
  nextTurn = () => {
    this.props.clean(this.props.turn + 1, this.nextStep)
  }
  draft = (index) => {
    if (this.props.player.draft > 0) {
      let card = this.props.draftStack[index]
      let score = this.props.player.happiness + card.happiness
      let draftStack = this.props.draftStack.slice(0, index).concat(this.props.draftStack.slice(index+1))
      this.props.draft(card, score, draftStack)
    }
  }
  draftStaple = (index) => {
    if (this.props.player.draft > 0) {
      let card = generate.staple(index)
      let score = this.props.player.happiness + card.happiness
      let stapleArray = this.props.stapleArray.map((val, i) => i===index ? val-1 : val)
      this.props.draftStaple(card, score, stapleArray)
    }
  }
  buyReward = (index) => {
    let effort = generate.lookupCardStackProperty('rewardArray', index, 'effort')
    if (this.props.player.effort >= effort) {
      let card = generate.reward(index)
      let score = this.props.player.happiness + card.happiness
      let rewardArray = this.props.rewardArray.map((val, i) => i===index ? val-1 : val)
      this.props.buy(card, score, rewardArray)
    }
  }
  render () {
    return (
      <Board {...this.state} {...this.props}
      start={this.ready}
      nextStep={this.continue}
      draft={this.draft}
      draftStaple={this.draftStaple}
      buyReward={this.buyReward}
      playCard={this.props.playCard} />
    )
  }
}

export default SoloGame
