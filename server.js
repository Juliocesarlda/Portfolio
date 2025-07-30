// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

let jogadores = {};
let nomes = { branca: null, preta: null };
let estadoJogo = null;

function corDisponivel() {
  if (!jogadores.branca) return 'branca';
  if (!jogadores.preta) return 'preta';
  return null;
}

io.on('connection', socket => {
  const cor = corDisponivel();
  if (!cor) {
    socket.emit('erro', 'Sala cheia');
    socket.disconnect();
    return;
  }

  jogadores[cor] = socket;

  socket.on('joinGame', ({ nome }) => {
    nomes[cor] = nome;
    socket.emit('assignColor', cor);
    io.emit('opponentInfo', nomes);

    if (jogadores.branca && jogadores.preta) {
      estadoJogo = criarEstadoInicial();
      io.emit('movimento', estadoJogo);
    }
  });

  socket.on('movimento', estado => {
    estadoJogo = estado;
    socket.broadcast.emit('movimento', estado);
  });

  socket.on('resetar', () => {
    estadoJogo = criarEstadoInicial();
    io.emit('resetar');
  });

  socket.on('disconnect', () => {
    if (jogadores[cor] === socket) {
      jogadores[cor] = null;
      nomes[cor] = null;
      io.emit('opponentInfo', nomes);
    }
  });
});

function criarEstadoInicial() {
  return {
    pecas: [
      ["&#9814;","&#9816;","&#9815;","&#9813;","&#9812;","&#9815;","&#9816;","&#9814;"],
      ["&#9817;","&#9817;","&#9817;","&#9817;","&#9817;","&#9817;","&#9817;","&#9817;"],
      ["","","","","","","",""],
      ["","","","","","","",""],
      ["","","","","","","",""],
      ["","","","","","","",""],
      ["&#9823;","&#9823;","&#9823;","&#9823;","&#9823;","&#9823;","&#9823;","&#9823;"],
      ["&#9820;","&#9822;","&#9821;","&#9819;","&#9818;","&#9821;","&#9822;","&#9820;"]
    ],
    vez: 'branca',
    enPassant: null
  };
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));