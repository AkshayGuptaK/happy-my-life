import React from 'react'

import Board from './Board'
import generate from '../generateCards'

class CoopGame extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      totalScore: 0,
      waiting: false
    }
  }
  componentDidMount () {
    this.props.socket.on('start', this.startGame)
    this.props.socket.on('acceptDraft', this.onDraftSuccess)
    this.props.socket.on('acceptDraftStaple', this.onDraftStapleSuccess)
    this.props.socket.on('acceptBuyReward', this.onBuyRewardSuccess)
    this.props.socket.on('Draft', (stack, score) => this.onOtherPlayerDraft(score, 'draftStack', stack))
    this.props.socket.on('stapleDraft', (stack, score) => this.onOtherPlayerDraft(score, 'stapleArray', stack))
    this.props.socket.on('rewardBuy', (stack, score) => this.onOtherPlayerDraft(score, 'rewardArray', stack))
    this.props.socket.on('reject', () => alert('Sorry, that card is already taken'))
    this.props.socket.on('nextStep', this.nextStep)
    this.props.socket.on('nextTurn', this.nextTurn)
    this.props.socket.on('end', this.props.end)
  }
  ready = () => {
    this.setState({ 'waiting': true })
    this.props.socket.emit('ready', this.props.id)
  }
  continue = () => {
    this.setState({ 'waiting': true })
    this.props.socket.emit('continue', this.props.id)
  }
  startGame = (game, score) => {
    this.setState({ 'totalScore': score })
    this.props.start(game.draftStack, game.stapleArray, game.rewardArray, this.continue)
  }
  nextStep = (newStep) => {
    this.setState({ 'waiting': false })
    this.props.next(newStep, this.continue)
  }
  nextTurn = (newTurn) => {
    this.props.clean(newTurn, this.continue)
  }  
  draft = (index) => {
    if (this.props.player.draft > 0) {
      this.props.socket.emit('draft', this.props.id, this.props.draftStack[index])
    }
  }
  draftStaple = (index) => {
    if (this.props.player.draft > 0) {
      this.props.socket.emit('draftStaple', this.props.id, index)
    }
  }
  buyReward = (index) => {
    let effort = generate.lookupCardStackProperty('rewardArray', index, 'effort')
    if (this.props.player.effort >= effort) {
      this.props.socket.emit('buyReward', this.props.id, index)
    }
  }
  onDraftSuccess = (draftStack, card, myScore, totalScore) => {
  this.setState({ 'totalScore': totalScore }, ()=>this.props.draft(card, myScore, draftStack))
  }
  onDraftStapleSuccess = (stapleArray, card, myScore, totalScore) => {
    this.setState({ 'totalScore': totalScore }, ()=>this.props.draftStaple(card, myScore, stapleArray))
  }
  onBuyRewardSuccess = (rewardArray, card, myScore, totalScore) => {
    this.setState({ 'totalScore': totalScore }, ()=>this.props.buy(card, myScore, rewardArray))
  }
  onOtherPlayerDraft = (score, stackName, stack) => {
    this.setState({ 'totalScore': score }, () => this.props.set(stackName, stack))
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

export default CoopGame
