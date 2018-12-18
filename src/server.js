const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const port = 8000
var id = 1

io.on('connection', (client) => {
  console.log('Connection made')
  client.on('newGame', () => id++ && client.emit('gameCreated', id))
})

server.listen(port, function () {
  console.log(`Server listening on port ${port}`)
})
