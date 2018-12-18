const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const port = 8000
var id = 0
var games = []

function getIDFromRoomName (room) {
  try {
    return Number(/Room (\d)+/.exec(room)[1])
  } catch (e) {
    return false
  }
}

function createGame (client) {
  id++
  client.join(`Room ${id}`)
  games.push(id)
  client.emit('gameCreated', id)
}

function joinGame (client, selected) {
  if (games.includes(getIDFromRoomName(selected))) {
    client.join(selected)
    client.emit('gameJoined')
    client.to(selected).emit('broadcast', 'sup')
  }
}

io.on('connection', (client) => {
  console.log('Connection made')
  client.emit('gamesList', games)
  client.on('newGame', () => createGame(client))
  client.on('joinGame', selected => joinGame(client, selected))
})

server.listen(port, function () {
  console.log(`Server listening on port ${port}`)
})
