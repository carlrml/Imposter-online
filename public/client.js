const socket = io();

function joinGame() {
  const name = document.getElementById('nameInput').value.trim();
  if (!name) return alert("Bitte Namen eingeben.");
  socket.emit('join', name);
  document.getElementById('join-section').style.display = 'none';
  document.getElementById('lobby').style.display = 'block';
}

function startGame() {
  const word = document.getElementById('wordInput').value.trim();
  if (!word) return alert("Bitte ein Wort eingeben.");
  socket.emit('start', word);
}

socket.on('updatePlayers', (names) => {
  const ul = document.getElementById('playerList');
  ul.innerHTML = '';
  names.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    ul.appendChild(li);
  });
});

socket.on('gameStarted', () => {
  document.getElementById('lobby').style.display = 'none';
  document.getElementById('game').style.display = 'block';
});

socket.on('showWord', (word) => {
  document.getElementById('yourWord').textContent = word;
});
