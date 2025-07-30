const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = {};
let gameState = null;

io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);

  // Adiciona jogador à sala se ainda houver vaga
  if (Object.keys(players).length < 2) {
    const cor = Object.keys(players).length === 0 ? "branca" : "preta";
    players[socket.id] = cor;
    socket.emit("assignColor", cor);

    // Informa ao outro jogador que o adversário entrou
    socket.broadcast.emit("opponentJoined");
  } else {
    socket.emit("salaCheia");
    socket.disconnect();
  }

  // Quando um jogador faz um movimento
  socket.on("joinGame", ({ nome }) => {
  players[socket.id] = { nome, color: /* atribua brancas/preta */ };
  socket.emit("assignColor", players[socket.id].color);
  socket.emit("opponentInfo", { nome: players[op.id]?.nome || null, color: players[op.id]?.color });
  if (opponente também conectado) {
    socket.to(opID).emit("opponentInfo", { nome: nomeLocal, color: players[socket.id].color });
  }
});


  socket.on("movimento", (data) => {
    socket.broadcast.emit("movimento", data); // envia para o oponente
    lastMoveTime = Date.now();
vez = data.vez;
iniciarTimerLocal();

  });

  socket.on("resetar", () => {
    socket.broadcast.emit("resetar");
  });

  socket.on("disconnect", () => {
    
    socket.broadcast.emit("opponentLeft");
    socket.on("opponentInfo", ({ nome, color }) => {
  if (nome) mostrarNomeOponente(nome, color);
  });
    console.log("Cliente desconectado:", socket.id);
    delete players[socket.id];
    
  });

  

});

app.use(express.static("public")); // pasta com index.html e JS

server.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
