import socketController from './socketController.js';

const http = require('http');
const { Server } = require('socket.io');

const initialSocket = (app) => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    // console.log(`User Connected: ${socket.id}`);  
    
    // play online
    socket.on('play online', (data) =>
      socketController.handlePlayOnline(io, socket, data)
    );

    // on move piece
    socket.on('move piece', (data) => {
      socketController.handleMovePiece(io, data);
    });

    // on send message
    socket.on('send message', (data) => {
      socketController.handleSendMessage(io, data);
    });

    // on end game
    socket.on('end game', (data) => {
      socketController.handleEndGame(socket, data);
    });

    // on draw
    socket.on('offer draw', (data) => {
      socketController.offerDraw(socket, data);
    });

    // deny draw invitation
    socket.on('deny draw invitation', (roomID) => {
      socketController.denyDrawInvitaion(socket, roomID);
    });

    // cancel invitation
    socket.on('cancel invitation', (roomID) => {
      socketController.cancelInvitaion(socket, roomID);
    });

    // on offer rematch game
    socket.on('offer rematch game', (data) => {
      socketController.offerRematchGame(socket, data);
    });

    // deny rematch invitation
    socket.on('deny rematch invitation', (roomID) => {
      socketController.denyRematchGame(socket, roomID);
    });

    // on handle rematch game
    socket.on('handle rematch game', (roomID) => {
      socketController.handleRematchGame(io, roomID);
    });

    // on start a new game
    socket.on('start new game', (roomID) => {
      socketController.handleStartNewGame(io, roomID);
    });

    // on re-connect
    socket.on('re-connect', (roomID) => {
      socketController.handleReConnect(io, socket, roomID);
    });
  });

  server.listen(3001, () => {
    console.log('server running at http://localhost:3001');
  });
};
export default initialSocket;
