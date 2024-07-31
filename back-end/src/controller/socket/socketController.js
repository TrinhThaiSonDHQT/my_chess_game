const { v4: uuidv4 } = require('uuid');

const handlePlayOnline = (io, socket, data) => {
  // get all currently rooms
  const rooms = io.sockets.adapter.rooms;

  var isEmptyRoom = true;
  rooms.forEach((socketIds, room) => {
    // because whenever each client connect to server, it will automate create a new room (the room ID and the client's socket ID are the same)
    // so we have to compare the room ID and the client's socket ID.

    // If they equal(roomID == socketID), it means that no game room is created. So we create new game room and the player has to wait for another one.

    // Otherwise, if there is an available game room(roomID != socketID), the player can join this room and start game.
    // Note that, if there is an available game room but it already contains two players. So this client has to create new room and wait for another one.

    const socketId = [...socketIds][0];
    // console.log(socketId);
    if ((socketId !== room) & (socketIds.size === 2)) {
      socket.join(room);

      // add information of another player
      let roomInfor = [...socketIds][1];
      roomInfor.player2 = {
        id: data.id,
        name: data.user_name,
        avater: null,
        pieceType: 'black',
      };

      io.to(room).emit('startGame', roomInfor);

      isEmptyRoom = false;
      // console.log('after: ', rooms.get(room));
      return;
    }
  });

  if (isEmptyRoom) {
    const roomID = uuidv4();
    console.log('create new room');
    socket.join(roomID);
    // socket.emit('status', 'please wait for another player...');

    let room = rooms.get(roomID);
    const roomInfor = {
      roomID: roomID,
      player1: {
        id: data.id,
        name: data.user_name,
        avatar: null,
        pieceType: 'white',
      },
      fen: null,
      nextTurn: 'white',
      remainTime: null,
      histories: [],
      messages: [],
    };
    room.add(roomInfor);
  }
  // console.log(rooms);
};

const handleMovePiece = (io, data) => {
  io.to(data.roomID).emit('move piece', data);
};

const handleSendMessage = (io, data) => {
  io.to(data.roomID).emit('send message', data.message);
};

const handleEndGame = (socket, data) => {
  socket.to(data.roomID).emit('end game', data);
};

const offerDraw = (socket, data) => {
  socket.to(data.roomID).emit('offer draw', data.userName);
};

const denyDrawInvitaion = (socket, roomID) => {
  socket.to(roomID).emit('deny draw invitation');
};

const cancelInvitaion = (socket, roomID) => {
  socket.to(roomID).emit('cancel invitation');
};

const offerRematchGame = (socket, data) => {
  socket.to(data.roomID).emit('offer rematch game', data.userName);
};

const denyRematchGame = (socket, roomID) => {
  socket.to(roomID).emit('deny rematch invitation');
};

const handleRematchGame = (io, roomID) => {
  io.to(roomID).emit('handle rematch game');
};

const handleStartNewGame = (io, roomID) => {
  io.in(roomID).socketsLeave(roomID);
};

export default {
  handlePlayOnline,
  handleMovePiece,
  handleSendMessage,
  handleEndGame,
  offerDraw,
  denyDrawInvitaion,
  cancelInvitaion,
  offerRematchGame,
  denyRematchGame,
  handleRematchGame,
  handleStartNewGame,
};
