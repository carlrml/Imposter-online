const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = {};
let gameStarted = false;
let word = '';
let imposterId = null;

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Verbunden:', socket.id);

  socket.on('join', (name) => {
    if (gameStarted) return;
    players[socket.id] = { name, word: '' };
    io.emit('updatePlayers', Object.values(players).map(p => p.name));
  });

  socket.on('start', (inputWord) => {
    if (gameStarted) return;
    word = inputWord;
    gameStarted = true;

    const ids = Object.keys(players);
    imposterId = ids[Math.floor(Math.random() * ids.length)];

    ids.forEach(id => {
      const playerWord = id === imposterId ? '??? Du bist der Imposter!' : word;
      players[id].word = playerWord;
      io.to(id).emit('showWord', playerWord);
    });

    io.emit('gameStarted');
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('updatePlayers', Object.values(players).map(p => p.name));
  });
});

server.listen(3000, () => {
  console.log('Server läuft unter http://localhost:3000');
});
