import React from 'react'
import { hot } from 'react-hot-loader'
import shortid from 'shortid'
// import { Route, Redirect, Switch } from 'react-router-dom'

import '../App.css'
import Hand from './Hand'
import Deck from './Deck'
import Discard from './Discard'
import DraftArray from './DraftArray'
import RewardArray from './RewardArray'
import StapleArray from './StapleArray'
import PlayZone from './PlayZone'
import cardList from '../cardList'

function generateCard (card) {
  return Object.assign({'id': shortid.generate()}, cardList[card])
}

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      player: { energy: 0, effort: 0, draft: 0, happiness: 0, turn: 0, step: 'begin' },
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
      player: { energy: 0, effort: 0, draft: 15, happiness: 1, turn: 1, step: 'play' },
      draftStack: [],
      stapleArray: [10, 10, 5, 5],
      rewardArray: [5, 5, 5, 5],
      deck: [generateCard('banana')]
    })
  }
  draw = () => {
    if (this.state.deck.length > 0) {
      let deck = this.state.deck
      let hand = this.state.hand
      hand.push(deck.shift())
      this.setState({ 'deck': deck, 'hand': hand})
    }
    else if (this.state.discard.length > 0) {
      this.setState({ 'deck': this.state.discard, 'discard': [] }, this.draw)
      // shuffle
    }
  }
  playCard = (e, id) => {
    if (this.state.player.step === 'play') {
      let hand = this.state.hand
      let play = this.state.play
      let index = hand.findIndex(card => card.id === id)
      play.push(hand.splice(index, 1)[0])
      this.setState({ 'hand': hand, 'play': play})
    }
  }
  draftStaple = (e, index) => {
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
  buyReward = (e, index) => {
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
      <div>
        { this.state.player.turn > 0
          ? null
          : <button onClick={this.startGame}>Start Game</button>
        }
        <div>
          <DraftArray cards={this.state.draftStack} />
          <StapleArray counts={this.state.stapleArray} draft={this.draftStaple}/>
          <RewardArray counts={this.state.rewardArray} buy={this.buyReward} />
        </div>
        <PlayZone cards={this.state.play} />
        <div>
          <Hand cards={this.state.hand} play={this.playCard} />
          <Deck cards={this.state.deck} onClick={this.draw} />
          <Discard cards={this.state.discard} />
        </div>
      </div>
    )
  }
}

export default hot(module)(App)
