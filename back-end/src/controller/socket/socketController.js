const { v4: uuidv4 } = require('uuid');

const handlePlayOnline = (io, socket, data) => {
  // get all currently rooms
  const rooms = io.sockets.adapter.rooms;

  var isEmptyRoom = true;
  rooms.forEach((socketIds, room) => {
    if (socketIds.size >= 2) {
      socketIds.forEach((item) => {
        if (typeof item === 'object') {
          if (item['state'] === 'waiting') {
            socket.join(room);

            // add information of another player
            item.player2 = {
              id: data.id,
              name: data.user_name,
              avater: null,
              pieceType: 'black',
            };

            // change state of game
            item.state = 'new game';
            io.to(room).emit('start game', item);
            isEmptyRoom = false;
            // console.log('after: ', rooms.get(room));
            return;
          }
        }
      });
    }
  });

  if (isEmptyRoom) {
    const roomID = uuidv4();
    socket.join(roomID);

    let room = rooms.get(roomID);
    const roomInfor = {
      roomID: roomID,
      player1: {
        id: data.id,
        name: data.user_name,
        avatar: null,
        pieceType: 'white',
      },
      state: 'waiting',
      fen: null,
      nextTurn: 'white',
      remainTime: null,
      histories: [],
      messages: [],
    };
    room.add(roomInfor);
    console.log('create new room');
  }
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

const handleReConnect = (io, socket, roomID) => {
  // get all currently rooms
  const rooms = io.sockets.adapter.rooms;
  const room = rooms.get(roomID);
  socket.join(roomID);
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
  handleReConnect,
};
