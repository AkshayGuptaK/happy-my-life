const shortid = require('shortid')

const cardList = require('./cardList')
const artPaths = require('./artPaths')
const draftDeck = require('./draftDeck')

const staples = ['banana', 'waterbottle', 'raincheck', 'sadmemory']
const rewards = ['boxofsweets', 'blueberrypie', 'goodtime', 'happymemory']

function generateCard (card) {
  return Object.assign({ 'id': shortid.generate(), 'art': artPaths[card] }, cardList[card])
}

function generateCards (card, count) {
  return Array(count).fill(card).map(generateCard)
}

exports.draftDeck = () => {
  return draftDeck.map(card => generateCards(card.name, card.count)).reduce((prev, curr) => prev.concat(curr))
}

exports.stapleArray = (players) => {
  return [10 * players, 10 * players, 5 * players, 5 * players]
}

exports.rewardArray = (players) => {
  return [5 * players, 5 * players, 5 * players, 5 * players]
}

exports.startDeck = () => {
  return generateCard(staples[0])
}

exports.staple = (index) => {
  return generateCard(staples[index])
}

exports.reward = (index) => {
  return generateCard(rewards[index])
}

exports.lookupCardProperty = (card, property) => {
  return cardList[card][property]
}

exports.lookupCardStackProperty = (stack, index, property) => {
  if (stack === 'rewardArray') {
    return cardList[rewards[index]][property]
  } return cardList[staples[index]][property]
}
