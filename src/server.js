const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const generate = require('./generateCards')
const gameFunctions = require('./gameFunctions')

const port = 8000
const maxTurns = 7

var gid = 0
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
  gid++
  client.join(`Room ${gid}`)
  games.push(new Game(gid, client))
  client.emit('joinGame', gid)
  io.emit('newGame', gid)
}

function joinGame (client, selected) {
  console.log('joining game') // debug
  let id = getIDFromRoomName(selected)
  let game = getGameFromID(id)
  if (game.state.turn === 0) {
    client.join(selected)
    game.players.push(client)
    game.state.status.push(false)
    game.state.happiness.push(0)
    client.emit('joinGame', id)
  } else {
    client.emit('rejectJoin')
  }
}

function leaveGame (id, client) {
  let game = getGameFromID(id)
  game.players.splice(getPlayerIndex(game, client), 1)
  if (game.players.length === 0) {
    games.splice(games.findIndex(session => session === game), 1)
    io.emit('gamesList', games.map(game => game.id))
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
  game.state.draftStack = gameFunctions.shuffle(generate.draftDeck())
  game.state.stapleArray = generate.stapleArray(game.players.length)
  game.state.rewardArray = generate.rewardArray(game.players.length)
  game.state.happiness.fill(1)
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
  let index = game.state.draftStack.findIndex(card => card.id === draftCard.id)
  if (index >= 0 & index < 4) {
    let card = game.state.draftStack.splice(index, 1)[0]
    game.state.happiness[getPlayerIndex(game, client)] += card.happiness
    let happiness = game.state.happiness[getPlayerIndex(game, client)]
    client.emit('acceptDraft', game.state.draftStack, card, happiness, game.totalScore())
    client.to(`Room ${id}`).emit('Draft', game.state.draftStack, game.totalScore())
  } else client.emit('reject')
}

function draftStaple (id, client, index) {
  console.log('drafting staple') // debug
  let game = getGameFromID(id)
  let stack = game.state.stapleArray

  if (stack[index] > 0) {
    stack[index]--
    let card = generate.staple(index)
    game.state.happiness[getPlayerIndex(game, client)] += card.happiness
    let happiness = game.state.happiness[getPlayerIndex(game, client)]
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
    game.state.happiness[getPlayerIndex(game, client)] += card.happiness
    let happiness = game.state.happiness[getPlayerIndex(game, client)]
    client.emit('acceptBuyReward', stack, card, happiness, game.totalScore())
    client.to(`Room ${id}`).emit('rewardBuy', stack, game.totalScore())
  } else client.emit('reject')
}

io.on('connection', (client) => {
  console.log('Connection made')
  client.emit('gamesList', games.map(game => game.id))
  client.on('newGame', () => createGame(client))
  client.on('joinGame', selected => joinGame(client, selected))
  client.on('leave', id => leaveGame(id, client))
  client.on('ready', id => playerReady(id, client, startGame))
  client.on('continue', id => playerReady(id, client, nextStep))
  client.on('draft', (id, card) => draft(id, client, card))
  client.on('draftStaple', (id, index) => draftStaple(id, client, index))
  client.on('buyReward', (id, index) => buyReward(id, client, index))
})

server.listen(port, function () {
  console.log(`Server listening on port ${port}`)
})
