var socket = io();

var connectionCount = document.getElementById('connection-count');

socket.on('usersConnected', function (count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});

var statusMessage = document.getElementById('status-message');

socket.on('statusMessage', function (message) {
  statusMessage.innerText = message;
});

var results = document.getElementById('results');

socket.on('voteCount', function (votes) {
	results.innerText = 'A:' + votes['A'] + ' B:' + votes['B'] + ' C:' + votes['C'] + ' D:' + votes['D'];
});

var currentVote = document.getElementById('current-vote')

socket.on('voteConfirmed', function (vote) {
	currentVote.innerText = 'Your current vote is ' + vote;
});

var buttons = document.querySelectorAll('#choices button');

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    socket.send('voteCast', this.innerText);
  });
}