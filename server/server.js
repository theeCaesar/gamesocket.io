const http = require('http')
const exp = require('express')
const path = require('path')
const socket = require('socket.io')
const XOGame = require('./XOGame')
const RPSGame = require('./RPSGame')


const app = exp()
app.use(exp.static(path.join(__dirname, '/../client')))



const server = http.createServer(app)
const io = socket(server)
let wp = null
let rooms = {}

const lobby = (roomId, sock, gameName) => {

	if (roomId in rooms) {
		if (rooms[roomId].indexOf(sock.id) > -1) {
			sock.emit('message', 'you are in this room')
			sock.emit('roomId', roomId) 

		} else if (rooms[roomId].length < 2) {
			rooms[roomId].push(sock.id)
			sock.roomId = roomId
			sock.emit('roomId', roomId)
			const sock0 = io.sockets.sockets.get(rooms[roomId][0])
			if (gameName == 'X/O' && sock0.roomtype == "X/O") {
				new XOGame(sock0, sock)
			} else if (gameName == 'RPS' && sock0.roomtype == 'RPS') {
				new RPSGame(sock0, sock)
			}{
				
			}
			

		} else {
			sock.emit('message', 'room is full')
		}

	} else {
		
		sock.roomId = roomId
		rooms[roomId] = [sock.id]
		sock.emit('message', 'waiting...')
		sock.emit('roomId', roomId)
		
	}
}

io.on('connection', (sock) => {

	const toLobby = (roomId) => {
		//roomId = [roomId, game name]
		lobby(roomId[0], sock, roomId[1])
	}

	sock.on('roomId', toLobby)
	
	sock.on('disconnect', () => {
		if (sock.roomId) {
			if (rooms[sock.roomId].length > 1) {
				rooms[sock.roomId].splice(rooms[sock.roomId].indexOf(sock.id), 1)
				const otherSock = io.sockets.sockets.get(rooms[sock.roomId][0])
				otherSock.emit('message', 'wait... your opponent ran')
				otherSock.emit('load', 'clearing the game')
			} else { 
				delete rooms[sock.roomId]
			}
		}
	})
})


server.on('error', (err)=> {
	console.error(err)
})

server.listen(8080, () => {
	console.log('it is ON')
})
