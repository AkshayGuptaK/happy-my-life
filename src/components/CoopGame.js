import React from 'react'

import cardList from '../cardList'
import gameFunctions from '../gameFunctions'
import generate from '../generateCards'
import Board from './Board'

class CoopGame extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      player: { energy: 0, effort: 0, draft: 0, happiness: 0 },
      totalScore: 0,
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
      waiting: false,
      ended: false
    }
    this.mode = 'coop'
    this.id = this.props.id
    this.socket = this.props.socket

    this.socket.on('start', this.startGame)
    this.socket.on('acceptDraft', this.onDraftSuccess)
    this.socket.on('acceptDraftStaple', this.onDraftStapleSuccess)
    this.socket.on('acceptBuyReward', this.onBuyRewardSuccess)
    this.socket.on('Draft', this.onDraft)
    this.socket.on('stapleDraft', this.onStapleDraft)
    this.socket.on('rewardBuy', this.onRewardBuy)
    this.socket.on('reject', () => alert('Sorry, that card is already taken'))
    this.socket.on('nextStep', this.nextStep)
    this.socket.on('nextTurn', this.nextTurn)
    this.socket.on('end', this.endGame)
  }
  ready = () => {
    this.setState({ 'waiting': true })
    this.socket.emit('ready', this.id)
  }
  continue = () => {
    this.setState({ 'waiting': true })
    this.socket.emit('continue', this.id)
  }
  startGame = (game, score) => {
    this.setState({
      player: { energy: 0, effort: 0, draft: 0, happiness: 1 },
      totalScore: score,
      turn: game.turn,
      draftStack: game.draftStack,
      stapleArray: game.stapleArray,
      rewardArray: game.rewardArray,
      deck: [generate.startDeck()],
    }, this.continue)
  }
  nextStep = (newStep) => {
    let stepFuncs = [this.beginStep, this.drawStep, this.draftStep, this.playStep, this.endStep]
    let step = newStep
    this.setState({ 'step': step, 'waiting': false }, stepFuncs[step])
  }
  finishedStep = () => {
    setTimeout(this.continue, 1000)
  }
  beginStep = () => {
    this.finishedStep()
  }
  drawStep = () => {
    for (let i=0; i<4; i++) {
      this.setState(gameFunctions.draw(this.state))
    }
    this.finishedStep()
  }
  draftStep = () => {
    let player = Object.assign({}, this.state.player)
    player.draft ++
    this.setState({ 'player': player })
  }
  playStep = () => {
  }
  endStep = () => {
    let player = Object.assign({}, this.state.player)
    player.energy = 0
    player.effort = 0
    player.draft = 0
    this.setState({ 'player': player }, this.finishedStep)
  }
  nextTurn = (newTurn) => {
    let turn = newTurn
    let discard = this.state.discard
    discard = discard.concat(this.state.play)
    this.setState({ 'turn': turn, 'discard': discard, 'play': [] }, this.nextStep(0))
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
      this.socket.emit('draft', this.id, this.state.draftStack[index])
    }
  }
  draftStaple = (index) => {
    if (this.state.player.draft > 0) {
      this.socket.emit('draftStaple', this.id, index)
    }
  }
  buyReward = (index) => {
    let effort = generate.lookupCardStackProperty('rewardArray', index, 'effort')
    if (this.state.player.effort >= effort) {
      this.socket.emit('buyReward', this.id, index)
    }
  }
  onAcquire = (card, myScore, totalScore) => {
    let state = Object.assign({}, this.state)
    state.discard.push(card)
    state.player.happiness = myScore
    state.totalScore = totalScore
    return state
  }
  onDraftSuccess = (draftStack, card, myScore, totalScore) => {
    let state = this.onAcquire(card, myScore, totalScore)
    state.draftStack = draftStack
    state.player.draft--
    this.setState(state)
  }
  onDraftStapleSuccess = (stapleArray, card, myScore, totalScore) => {
    let state = this.onAcquire(card, myScore, totalScore)
    state.stapleArray = stapleArray
    state.player.draft--
    this.setState(state)
  }
  onBuyRewardSuccess = (rewardArray, card, myScore, totalScore) => {
    let state = this.onAcquire(card, myScore, totalScore)
    state.rewardArray = rewardArray
    state.player.effort -= card.effort
    this.setState(state)
  }
  onDraft = (draftStack, totalScore) => {
    this.setState({ 'draftStack': draftStack, 'totalScore': totalScore })
  }
  onStapleDraft = (stapleArray, totalScore) => {
    this.setState({ 'stapleArray': stapleArray, 'totalScore': totalScore })
  }
  onRewardBuy = (rewardArray, totalScore) => {
    this.setState({ 'rewardArray': rewardArray, 'totalScore': totalScore })
  }
  endGame = (score) => {
    alert(`Your final score is ${score}`)
    this.setState({ 'ended': true })
  }
  render () {
    return (
      <Board {...this.state}
      start={this.ready}
      nextStep={this.continue}
      draft={this.draft}
      draftStaple={this.draftStaple}
      buyReward={this.buyReward}
      playCard={this.playCard} 
      quit={this.props.quit} />
    )
  }
}

export default CoopGame
