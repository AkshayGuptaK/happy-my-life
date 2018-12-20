const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const generate = require('./generateCards')

const port = 8000
const maxTurns = 10

var Gid = 0
var games = []

class Game {
  constructor (id, client) {
    this.id = id
    this.players = [client]
    this.state = { turn: 0, step: 0, status: [false], happiness: [0], draftStack: [], stapleArray: [], rewardArray: [] }
  }
  totalScore () {
    return this.state.happiness.reduce((curr, prev) => curr + prev)
  }
}

function getIDFromRoomName (room) {
  try {
    return Number(/Room (\d)+/.exec(room)[1])
  } catch (e) {
    return false
  }
}

function getGameFromID (id) {
  return games.filter(game => game.id === id)[0]
}

function getPlayerIndex (game, client) {
  return game.players.findIndex(player => player === client)
}

function createGame (client) {
  console.log('creating game') // debug
  Gid++
  client.join(`Room ${Gid}`)
  games.push(new Game(Gid, client))
  io.emit('gameCreated', Gid) // update game lists in lobbies
}

function joinGame (client, selected) {
  console.log('joining game') // debug
  let id = getIDFromRoomName(selected)
  let game = getGameFromID(id)
  if (game) {
    client.join(selected) // should check if a player is already in a game
    game.players.push(client)
    game.state.status.push(false)
    game.state.happiness.push(0)
    client.emit('gameJoined', id)
  }
}

function playerReady (id, client, completeFunc) {
  console.log('player ready') // debug
  let game = getGameFromID(id)
  let index = getPlayerIndex(game, client)
  game.state.status[index] = true
  if (game.state.status.every(status => status)) {
    game.state.status.fill(false)
    completeFunc(game)
  }
}

function startGame (game) {
  console.log('starting game') // debug
  game.state.turn = 1
  game.state.draftStack = generate.draftDeck()
  game.state.stapleArray = generate.stapleArray(game.players.length)
  game.state.rewardArray = generate.rewardArray(game.players.length)
  io.to(`Room ${game.id}`).emit('start', game.state, game.totalScore())
}

function nextStep (game) {
  console.log('next step') // debug
  game.state.step++
  if (game.state.step !== 5) {
    io.to(`Room ${game.id}`).emit('nextStep', game.state.step)
  } else {
    if (game.state.turn >= maxTurns) {
      io.to(`Room ${game.id}`).emit('end', game.totalScore())
    } else {
      game.state.step = 0
      game.state.turn++
      io.to(`Room ${game.id}`).emit('nextTurn', game.state.turn)
    }
  }
}

function draft (id, client, draftCard) {
  console.log('drafting card') // debug
  let game = getGameFromID(id)
  let index = game.draftStack.indexOf(draftCard)
  if (index >= 0 & index < 4) {
    let card = game.draftStack.splice(index, 1)
    let happiness = game.state.happiness[getPlayerIndex(game, client)] += card.happiness
    client.emit('acceptDraft', game.draftStack, card, happiness, game.totalScore())
    client.to(`Room ${id}`).emit('Draft', game.draftStack, game.totalScore())
  } else client.emit('reject')
}

function draftStaple (id, client, index) {
  console.log('drafting staple') // debug
  let game = getGameFromID(id)
  let stack = game.state.stapleArray

  if (stack[index] > 0) {
    stack[index]--
    let card = generate.staple(index)
    let happiness = game.state.happiness[getPlayerIndex(game, client)] += card.happiness
    client.emit('acceptDraftStaple', stack, card, happiness, game.totalScore())
    client.to(`Room ${id}`).emit('stapleDraft', stack, game.totalScore())
  } else client.emit('reject')
}

function buyReward (id, client, index) {
  console.log('buying reward') // debug
  let game = getGameFromID(id)
  let stack = game.state.rewardArray

  if (stack[index] > 0) {
    stack[index]--
    let card = generate.reward(index)
    let happiness = game.state.happiness[getPlayerIndex(game, client)] += card.happiness
    client.emit('acceptBuyReward', stack, card, happiness, game.totalScore())
    client.to(`Room ${id}`).emit('rewardBuy', stack, game.totalScore())
  } else client.emit('reject')
}

io.on('connection', (client) => {
  console.log('Connection made')
  client.emit('gamesList', games)
  client.on('blash', () => console.log('errr'))
  client.on('newGame', () => createGame(client))
  client.on('joinGame', selected => joinGame(client, selected))
  client.on('ready', (id) => playerReady(id, client, startGame))
  client.on('continue', (id) => playerReady(id, client, nextStep))
  client.on('draft', (id, card) => draft(id, client, card))
  client.on('draftStaple', (id, index) => draftStaple(id, client, index))
  client.on('buyReward', (id, index) => buyReward(id, client, index))
})

server.listen(port, function () {
  console.log(`Server listening on port ${port}`)
})
