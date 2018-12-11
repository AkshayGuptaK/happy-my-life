import React from 'react'
import { hot } from 'react-hot-loader'
// import { Route, Redirect, Switch } from 'react-router-dom'

import '../App.css'
import Hand from './Hand'
import Deck from './Deck'
import Discard from './Discard'
import DraftArray from './DraftArray'
import RewardArray from './RewardArray'
import StapleArray from './StapleArray'
import cardList from '../cardList'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      player: { energy: 0, effort: 0, draft: 0, happiness: 0, turn: 0, step: 0 },
      draftStack: [],
      stapleArray: [],
      rewardArray: [],
      hand: [],
      deck: [],
      discard: [],
      trash: []
    }
  }
  startGame = () => {
    this.setState({
      player: { energy: 0, effort: 0, draft: 5, happiness: 1, turn: 1, step: 0 },
      draftStack: [],
      stapleArray: [10, 10, 5, 5],
      rewardArray: [5, 5, 5, 5],
      deck: [cardList['banana']]
    })
  }
  draw = () => {
    if (this.state.deck.length > 0) {
      let deck = this.state.deck
      let hand = this.state.hand
      hand.push(deck.shift())
      console.log('deck is', deck) // debug
      this.setState({ 'deck': deck, 'hand': hand})
    }
    else if (this.state.discard.length > 0) {
      this.setState({ 'deck': this.state.discard, 'discard': [] }, this.draw())
      // shuffle
    }
  }
  draftStaple = (e, id) => {
    let staples = ['banana', 'waterbottle', 'raincheck', 'sadmemory']
    if (this.state.player.draft > 0) {
      let player = this.state.player
      let stapleArray = this.state.stapleArray
      let discard = this.state.discard
      player.draft -=1
      stapleArray[id] -=1
      discard.push(cardList[staples[id]])
      this.setState({ 'player': player, 'stapleArray': stapleArray, 'discard': discard })
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
          <RewardArray counts={this.state.rewardArray} />
        </div>
        <div onClick={this.draw}>
          <Hand cards={this.state.hand} />
          <Deck cards={this.state.deck} />
          <Discard cards={this.state.discard} />
        </div>
      </div>
    )
  }
}

export default hot(module)(App)
