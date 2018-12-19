import React from 'react'
import shortid from 'shortid'

import cardList from '../cardList'
import gameFunctions from '../gameFunctions'
import artPaths from '../artPaths'
import draftDeck from '../draftDeck'
import Board from './Board'

function generateCard (card) {
  return Object.assign({'id': shortid.generate(), 'art': artPaths[card]}, cardList[card])
}

function generateCards (card, count) {
  return Array(count).fill(card).map(generateCard)
}

function generateDraftDeck () {
  return draftDeck.map(card => generateCards(card.name, card.count)).reduce((prev, curr) => prev.concat(curr))
}

class SoloGame extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      mode: 'solo',
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
      trash: []
    }
  }
  startGame = () => {
    this.setState({
      player: { energy: 0, effort: 0, draft: 0, happiness: 1 },
      turn: 1,
      draftStack: gameFunctions.shuffle(generateDraftDeck()),
      stapleArray: [10, 10, 5, 5],
      rewardArray: [5, 5, 5, 5],
      deck: [generateCard('banana')]
    }, this.nextStep)
  }
  nextStep = () => {
    let stepFuncs = [this.beginStep, this.drawStep, this.draftStep, this.playStep, this.endStep]
    let step = (this.state.step + 1) % 5
    this.setState({ 'step': step }, stepFuncs[step])
  }
  beginStep = () => {
    let turn = this.state.turn + 1
    this.setState({ 'turn': turn })
    setTimeout(this.nextStep, 1000)
  }
  drawStep = () => {
    for (let i=0; i<4; i++) {
      this.setState(gameFunctions.draw(this.state))
    }
    setTimeout(this.nextStep, 1000)
  }
  draftStep = () => {
    let player = Object.assign({}, this.state.player)
    player.draft ++
    this.setState({ 'player': player })
  }
  playStep = () => {
  }
  endStep = () => {
    if (this.state.turn === 5) {
      alert(`Your final score is ${this.state.player.happiness}`)
    } else {
      let discard = this.state.discard
      discard = discard.concat(this.state.play)
      this.setState({ 'discard': discard, 'play': [] })
      setTimeout(this.nextStep, 1000)
    }
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
  draft = (index) => {
    if (this.state.player.draft > 0) {
      let player = this.state.player
      let draftStack = this.state.draftStack
      let discard = this.state.discard
      let card = draftStack.splice(index, 1)[0]
      player.draft -=1
      player.happiness += card.happiness
      discard.push(card)
      this.setState({ 'player': player, 'draftStack': draftStack, 'discard': discard })
    }
  }
  draftStaple = (index) => {
    let staples = ['banana', 'waterbottle', 'raincheck', 'sadmemory']
    if (this.state.player.draft > 0) {
      let player = this.state.player
      let stapleArray = this.state.stapleArray
      let discard = this.state.discard
      let card = generateCard(staples[index])
      player.draft -=1
      player.happiness += card.happiness
      stapleArray[index] -=1
      discard.push(card)
      this.setState({ 'player': player, 'stapleArray': stapleArray, 'discard': discard })
    }
  }
  buyReward = (index) => {
    let rewards = ['boxofsweets', 'blueberrypie', 'goodtime', 'happymemory']
    let card = generateCard(rewards[index])
    if (this.state.player.effort >= card.effort) {
      let player = this.state.player
      let rewardArray = this.state.rewardArray
      let discard = this.state.discard
      player.effort -= card.effort
      player.happiness += card.happiness
      rewardArray[index] -=1
      discard.push(card)
      this.setState({ 'player': player, 'rewardArray': rewardArray, 'discard': discard })
    }
  }
  render () {
    return (
      <Board {...this.state} 
      start={this.startGame}
      nextStep={this.nextStep}
      draft={this.draft}
      draftStaple={this.draftStaple}
      buyReward={this.buyReward}
      playCard={this.playCard} />
    )
  }
}

export default SoloGame
