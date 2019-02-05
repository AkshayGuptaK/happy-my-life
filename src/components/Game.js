import React from 'react'

import cardList from '../cardList'
import gameFunctions from '../gameFunctions'
import generate from '../generateCards'

function GameLogic (ModeComponent, props) {
  return class extends React.Component {
    constructor () {
      super()
      this.state = {
        player: { energy: 0, effort: 0, draft: 0, happiness: 0 },
        turn: 0,
        step: 0,
        draftStack: [],
        stapleArray: [],
        rewardArray: [],
        hand: [],
        deck: [],
        discard: [],
        play: [],
        trash: [],
        ended: false
      }
      this.stepFuncs = [this.beginStep, this.drawStep, this.draftStep, this.playStep, this.endStep]
    }
    startGame = (draftStack, stapleArray, rewardArray, callbackFunc) => {
      this.setState({
        player: { energy: 0, effort: 0, draft: 0, happiness: 1 },
        turn: 1,
        draftStack: draftStack,
        stapleArray: stapleArray,
        rewardArray: rewardArray,
        deck: [generate.startDeck()],
      }, callbackFunc)
    }
    nextStep = (newStep, continueFunc) => {
      this.setState({ 'step': newStep }, this.stepFuncs[newStep](continueFunc))
    }
    beginStep = (continueFunc) => {
      setTimeout(continueFunc, 1000)
    }
    drawStep = (continueFunc) => {
      for (let i=0; i<4; i++) {
        this.setState(gameFunctions.draw(this.state))
      }
      setTimeout(continueFunc, 1000)
    }
    draftStep = () => {
      let player = Object.assign({}, this.state.player)
      player.draft ++
      this.setState({ 'player': player })
    }
    playStep = () => {
    }
    endStep = (continueFunc) => {
      setTimeout(continueFunc, 1000)
    }
    cleanUp = (newTurn, continueFunc) => {
      let player = Object.assign({}, this.state.player)
      let discard = this.state.discard
      player.energy = 0
      player.effort = 0
      player.draft = 0
      discard = discard.concat(this.state.play)
      this.setState({ 'player': player, 'turn': newTurn, 'discard': discard, 'play': [] }, this.nextStep(0, continueFunc))
    }
    acquireCard = (card, score) => {
      let state = Object.assign({}, this.state)
      state.discard.push(card)
      state.player.happiness = score
      return state
    }
    setStack = (stack, newStack) => {
      let state = {}
      state[stack] = newStack
      this.setState(state)
    }
    draftCard = (card, score, draftStack) => {
      let state = this.acquireCard(card, score)
      state.draftStack = draftStack
      state.player.draft--
      this.setState(state)
    }
    draftStaple = (card, score, stapleArray) => {
      let state = this.acquireCard(card, score)
      state.stapleArray = stapleArray
      state.player.draft--
      this.setState(state)
    }
    buyReward = (card, score, rewardArray) => {
      let state = this.acquireCard(card, score)
      state.rewardArray = rewardArray
      state.player.effort -= card.effort
      this.setState(state)
    }
    playCard = (id) => {
      if (this.state.step === 3) {
        let hand = this.state.hand
        let index = hand.findIndex(card => card.id === id)
        let card = hand[index]
        if (card.energy <= this.state.player.energy & !card.type.includes('Memory')) {
          let cardLookup = Object.keys(cardList).find(key => cardList[key].name === card.name)
          let state = gameFunctions.cardFuncs[cardLookup](Object.assign({}, this.state))
          state.player.energy -= card.energy
          state.play.push(state.hand.splice(index, 1)[0])
          this.setState(state)
        }
      }
    }
    endGame = (score) => {
      alert(`Your final score is ${score}`)
      this.setState({ 'ended': true })
    }
    render () {
      return <ModeComponent {...this.state}
        {...props}
        start={this.startGame}
        next={this.nextStep}
        clean={this.cleanUp}
        end={this.endGame}
        draft={this.draftCard}
        draftStaple={this.draftStaple}
        buy={this.buyReward}
        playCard={this.playCard}
        set={this.setStack} />
    }
  }
}

export default GameLogic
