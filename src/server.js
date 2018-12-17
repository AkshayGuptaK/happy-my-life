const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const port = 8000

io.on('connection', () => console.log('Connection made'))
server.listen(port, function () {
  console.log(`Server listening on port ${port}`)
})
