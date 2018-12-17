import React from 'react'
import shortid from 'shortid'

import Counter from './Counter'
import Hand from './Hand'
import Deck from './Deck'
import Discard from './Discard'
import DraftArray from './DraftArray'
import RewardArray from './RewardArray'
import StapleArray from './StapleArray'
import PlayZone from './PlayZone'
import TurnPanel from './TurnPanel'

import cardList from '../cardList'
import gameFunctions from '../gameFunctions'
import artPaths from '../artPaths'
import draftDeck from '../draftDeck'

function generateCard (card) {
  return Object.assign({'id': shortid.generate(), 'art': artPaths[card]}, cardList[card])
}

function generateCards (card, count) {
  return Array(count).fill(card).map(generateCard)
}

function generateDraftDeck () {
  return draftDeck.map(card => generateCards(card.name, card.count)).reduce((prev, curr) => prev.concat(curr))
}

class Board extends React.Component {
  constructor (props) {
    super(props)
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
      trash: []
    }
  }
  startGame = () => {
    this.setState({
      player: { energy: 0, effort: 0, draft: 0, happiness: 1 },
      turn: 1,
      step: 0,
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
      <div className='board'>
        { this.state.turn > 0
          ? null
          : <button onClick={this.startGame}>Start Game</button>
        }
        { this.state.step === 2 | this.state.step === 3
          ? <button onClick={this.nextStep}>Continue</button>
          : null
        }
        <TurnPanel turn={this.state.turn} step={this.state.step} />
        <div className='draftPot'>
          <DraftArray cards={this.state.draftStack} draft={this.draft} />
          <StapleArray counts={this.state.stapleArray} draft={this.draftStaple} />
          <RewardArray counts={this.state.rewardArray} buy={this.buyReward} />
        </div>
        <PlayZone cards={this.state.play} />
        <div className='playerPanel'>
          <Counter {...this.state.player} />
          <Hand cards={this.state.hand} play={this.playCard} />
          <Deck cards={this.state.deck} onClick={this.draw} />
          <Discard cards={this.state.discard} />
        </div>
      </div>
    )
  }
}

export default Board