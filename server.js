const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const app = express();

var votes = {};

app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

function countVotes(votes) {
	var voteCount = {
	    A: 0,
	    B: 0,
	    C: 0,
	    D: 0
	};
  for (vote in votes) {
    voteCount[votes[vote]]++
  }
  return voteCount;
}

const port = process.env.PORT || 3000;
const server = http.createServer(app)
								 .listen(port, function() {
								 	 console.log('Listening on port ' + port + '.');
								 });

const io = socketIo(server);

io.on('connection', function (socket) {
	console.log('A user has connected.', io.engine.clientsCount);

	io.sockets.emit('usersConnected', io.engine.clientsCount);

	socket.emit('statusMessage', 'You have connected.');

	socket.on('message', function (channel, message) {
  if (channel === 'voteCast') {
	    votes[socket.id] = message;
	    socket.emit('voteConfirmed', message)
	    io.sockets.emit('voteCount', countVotes(votes));
	  }
	});

	socket.on('disconnect', function () {
	  console.log('A user has disconnected.', io.engine.clientsCount);
	  delete votes[socket.id];
	  console.log(votes);
	  io.sockets.emit('userConnection', io.engine.clientsCount);
	});
})

module.exports = server;