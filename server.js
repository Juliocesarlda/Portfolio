const express = require('express');
const http = require('http');
const io = require('socket.io');

const app = express();
const srv = http.createServer(app);
const socket = io(srv);

const players = {};

socket.on('connection', sock => {
  sock.on('joinGame', ({ nome }) => {
    const cor = !players.branca ? 'branca' : (!players.preta ? 'preta' : null);
    if (!cor) return sock.emit('salaCheia');
    players[cor] = { id: sock.id, nome };
    sock.emit('assignColor', cor);

    const obj = {
      branca: players.branca?.nome,
      preta: players.preta?.nome
    };
    socket.emit('opponentInfo', obj);
  });

  sock.on('movimento', data => sock.broadcast.emit('movimento', data));
  sock.on('resetar', () => sock.broadcast.emit('resetar'));

  sock.on('disconnect', () => {
    for (const cor of ['branca','preta']){
      if (players[cor]?.id === sock.id) delete players[cor];
    }
    socket.emit('opponentLeft');
  });
});

app.use(express.static('public'));
srv.listen(3000, () => console.log('Servidor rodando em localhost:3000'));
