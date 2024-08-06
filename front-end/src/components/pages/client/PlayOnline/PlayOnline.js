import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import io from 'socket.io-client';
import { createContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import '../../../Container/Container.scss';
import DialogEndGame from '../../../dialogEndGame/DialogEndGame';
import DialogMessages from '../../../dialogMessages/DialogMessages';
import TimeOptions from '../../../rightSideController/timeOptions/TimeOptions';
import Sidebar from '../../../sidebar/Sidebar';
import HistoriesAndChats from '../../../rightSideController/HistoriesAndChats/HistoriesAndChats';
import PlayersSection from '../../../players/PlayersSection';
// import { createAxios } from '../../../../redux/createInstance';
// import { addNewGame } from '../../../../redux/apiRequest';
import IPAddress from '../../../../IPAddress';
import { showMessages, setRoomInfor } from '../../../../redux/gameSlice';

const socket = io.connect(`http://${IPAddress}:3001`);

export const HistoriesContext = createContext();
export const InforOfRoomContext = createContext();

function PlayOnline() {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState('');
  const [moveTo, setMoveTo] = useState(null);
  const [optionSquares, setOptionSquares] = useState({});
  const [isEndGame, setEndGame] = useState(false);
  const [roomID, setRoomID] = useState('');
  const [roomInforCopy, setRoomInforCopy] = useState(null);
  const [orderOfPlayer, setOrderOfPlayer] = useState(null);
  const [pieceType, setPieceType] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [controllerSide, setControllerSide] = useState(null);
  const [histories, setHistories] = useState([]);
  // const [showPromotionDialog, setShowPromotionDialog] = useState(false);

  const dispath = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const messages = useSelector((state) => state.game.messages);
  const roomInfor = useSelector((state) => state.game.roomInfor);
  // const axiosJWT = createAxios(user, dispath, loginSuccess);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
   
    if (roomInfor != null) {
      setInforToPlayer(roomInfor);
    } else {
      setControllerSide(<TimeOptions playingOptions={playingOptions} />);
    }
  }, []);

  // handle when players reconnect or update new information
  useEffect(() => {
    if (roomInfor != null) {
      setRoomInforCopy(roomInfor);
    }
  }, [roomInfor]);

  useEffect(() => {
    // on start game
    socket.on('startGame', (data) => {
      // console.log(data);
      setRoomID(data.roomID);
      setInforToPlayer(data);
      dispath(showMessages(null));
      dispath(setRoomInfor(data));
    });

    // on move piece
    socket.on('move piece', (data) => {
      // console.log(data);
      movePiece(data);
    });

    // on send or receive message
    socket.on('send message', (message) => {
      setRoomInforCopy((preValue) => {
        let messages = preValue.messages;
        messages = [...messages, message];
        let newRoomInfor = { ...preValue, messages };
        dispath(setRoomInfor(newRoomInfor));
        return preValue;
      });
    });

    // on send or receive message
    socket.on('end game', (data) => {
      dispath(setRoomInfor(data));
      dispath(showMessages(null));
      setEndGame(true);
    });

    // on offer draw
    socket.on('offer draw', (username) => {
      // console.log(username);
      const infor = {
        messages: `${username} offer a draw with you`,
        inforButton: {
          buttonCancel: {
            name: 'Cancel',
            option: 'deny draw invitation',
            background: 'dark',
          },
          buttonAccept: {
            name: 'Yes',
            option: 'accept draw invitation',
            background: 'green',
          },
        },
      };
      dispath(showMessages(infor));
    });

    // when opponent want to deny the invitation
    socket.on('deny draw invitation', () => {
      // set information for dialog messages when oppent denied the draw invitaion
      const infor = {
        messages: 'Opponent denied your invitation',
        inforButton: {
          buttonCancel: {
            name: 'Cancel',
            option: '',
            background: 'green',
          },
        },
      };
      dispath(showMessages(infor));
    });

    // cancel invitaion
    socket.on('cancel invitation', () => {
      // set information for dialog messages when oppent canceled the invitaion
      const infor = {
        messages: 'Opponent canceled the invitation!',
        inforButton: {
          buttonCancel: {
            name: 'Cancel',
            option: '',
            background: 'green',
          },
        },
      };
      dispath(showMessages(infor));
    });

    // on offer rematch game
    socket.on('offer rematch game', (userName) => {
      setEndGame(false);

      // set information for dialog messages
      const infor = {
        messages: `${userName} Want To Play Again With You`,
        inforButton: {
          buttonCancel: {
            name: 'Cancel',
            option: 'deny rematch invitation',
            background: 'dark',
          },
          buttonAccept: {
            name: 'Yes',
            option: 'accept rematch invitation',
            background: 'green',
          },
        },
      };
      dispath(showMessages(infor));
    });

    // deny rematch invitation
    socket.on('deny rematch invitation', () => {
      // set information for dialog messages when oppent denied the rematch game invitaion
      const infor = {
        messages: 'Opponent denied your invitation',
        inforButton: {
          buttonCancel: {
            name: 'Cancel',
            option: '',
            background: 'green',
          },
        },
      };
      dispath(showMessages(infor));
    });

    // on handle rematch game
    socket.on('handle rematch game', () => {
      // turn off dialog invitation or waiting
      dispath(showMessages(null));

      reset();

      setPieceType((preValue) => {
        let type = preValue === 'white' ? 'black' : 'white';
        setIsMyTurn(type === 'white' ? true : false);
        return type;
      });

      setRoomInforCopy((preValue) => {
        let player1 = { ...preValue['player1'] };
        let player2 = { ...preValue['player2'] };
        
        if (player1.isWon) delete player1.isWon;
        if (player2.isWon) delete player2.isWon;


        if (player1['pieceType'] === 'white') {
          player1['pieceType'] = 'black';
          player2['pieceType'] = 'white';
        } else {
          player1['pieceType'] = 'white';
          player2['pieceType'] = 'black';
        }

        let nextTurn = 'white';
        let state = 'new game';

        let newRoomInfor = {
          ...preValue,
          player1,
          player2,
          nextTurn,
          state,
        };

        dispath(setRoomInfor(newRoomInfor));
        return preValue;
      });
      // reset timer for player
      // const remaindTime = {
      //   minutes: 10,
      //   seconds: 0,
      // };
      // const newInforOfRoom = { ...inforOfRoom };
      // newInforOfRoom['player1'].remaindTime = remaindTime;
      // newInforOfRoom['player2'].remaindTime = remaindTime;
      // // console.log(newInforOfRoom);
      // setInforOfRoom(newInforOfRoom);
      // setIsStartGame(true);
    });
  }, [socket]);

  function setInforToPlayer(data) {
    // console.log(data);
    const player = getPlayer(data, 'id', user?.id);
    setPieceType(data[player].pieceType);
    setOrderOfPlayer(player);
    if (data.state === 'finish') {
      setEndGame(true);
    }
    setRoomID(data.roomID);
    movePiece(data);

    setControllerSide(
      <HistoriesAndChats handleFinishGame={handleFinishGame} />
    );
  }

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = g;
      modify(update);
      return update;
    });
  }

  function checkEndGame() {
    const possibleMoves = game.moves();
    // exit if the game is over
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
      return true;
    return false;
  }

  function handleEndGame(option = null) {
    setEndGame(true);
    dispath(showMessages(null));

    let pieceType;
    setPieceType((preValue) => {
      pieceType = preValue;

      let newRoomInfor;
      setRoomInforCopy((preValue) => {
        newRoomInfor = { ...preValue };

        // update state
        newRoomInfor.state = 'finish';
        // add new property - pieceTypeWin
        if (option === 'accept draw invitation')
          newRoomInfor.pieceTypeWon = 'draw game';
        else {
          let playerWon;
          if (option === 'offer resign' || option === 'offer abort') {
            let pieceTypeWon = pieceType === 'white' ? 'black' : 'white';
            newRoomInfor.pieceTypeWon = pieceTypeWon;
            playerWon = getPlayer(newRoomInfor, 'pieceType', pieceTypeWon);
          } else {
            newRoomInfor.pieceTypeWon = pieceType;
            playerWon = getPlayer(newRoomInfor, 'pieceType', pieceType);
          }
          // add property "isWon" for player who won the game
          if (playerWon === 'player1') {
            let player1 = { ...newRoomInfor['player1'] };
            player1.isWon = true;
            newRoomInfor = { ...newRoomInfor, player1 };
          } else {
            let player2 = { ...newRoomInfor['player2'] };
            player2.isWon = true;
            newRoomInfor = { ...newRoomInfor, player2 };
          }
        }
        // console.log(newRoomInfor);

        // insert infor of game into database
        // addNewGameToDB(newRoomInfor);

        dispath(setRoomInfor(newRoomInfor));
        socket.emit('end game', newRoomInfor);

        return preValue;
      });
      return preValue;
    });
  }

  // function addNewGameToDB(inforOfRoom) {
  // const game = {
  //   player1: {
  //     username: inforOfRoom['player1']['name'],
  //     pieceType: inforOfRoom['player1']['pieceType'],
  //   },
  //   player2: {
  //     username: inforOfRoom['player2']['name'],
  //     pieceType: inforOfRoom['player2']['pieceType'],
  //   },
  //   wonPlayer: inforOfRoom['pieceTypeWon'],
  //   moves: histories?.length,
  //   date: getCurrentDate(),
  //   history: histories,
  // };
  // // console.log(game);
  // // addNewGame(game, user, user?.accessToken, dispath, axiosJWT);
  // addNewGame(game, dispath);
  // }

  // function getCurrentDate() {
  //   const today = new Date();
  //   const yyyy = today.getFullYear();
  //   let mm = today.getMonth() + 1; // Months start at 0!
  //   let dd = today.getDate();

  //   if (dd < 10) dd = '0' + dd;
  //   if (mm < 10) mm = '0' + mm;

  //   const formattedToday = dd + '/' + mm + '/' + yyyy;
  //   return formattedToday;
  // }

  function getMoveOptions(square) {
    // get all possible moves
    const moves = game.moves({
      square,
      verbose: true,
    });

    // if the square is empty or the piece on square is protecing the king -> no possible moves
    if (moves.length === 0) {
      let optionSquares = {};

      // if square contains piece but hasn't possible moves then still set this square's background to yellow
      if (game.get(square)) {
        optionSquares = {
          [square]: {
            background: 'rgba(255, 255, 0, 0.4)',
          },
        };
      }
      setOptionSquares(optionSquares);
      return false;
    }

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%',
      };
      return move;
    });
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)',
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(square) {
    // if not player's turn then they cannot click on any piece
    if (!isMyTurn) return;

    const squareObject = game.get(square);
    // if this square contain a piece
    if (squareObject) {
      const pieceColor = squareObject.color;
      // prevent player from click on piece's opponent
      // howerver, when you want to attack to piece's opponent that is valid
      if (
        (pieceColor === 'b' && pieceType === 'white') ||
        (pieceColor === 'w' && pieceType === 'black')
      ) {
        // check if the player want to attack to piece's opponent, this is valid
        let inValidMove = true;
        for (const opSquare in optionSquares) {
          if (square === opSquare) {
            inValidMove = false;
            break;
          }
        }
        if (inValidMove) return;
      }
    }

    // from square
    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    // to square
    if (!moveTo) {
      // check if valid move before showing dialog
      const moves = game.moves({
        moveFrom,
        verbose: true,
      });
      // console.log(moves);
      const foundMove = moves.find(
        (m) => m.from === moveFrom && m.to === square
      );
      // not a valid move
      if (!foundMove) {
        // check if clicked on new piece
        const hasMoveOptions = getMoveOptions(square);
        // if new piece, setMoveFrom, otherwise clear moveFrom
        setMoveFrom(hasMoveOptions ? square : '');
        return;
      }

      // valid move
      setMoveTo(square);

      // if promotion move
      if (
        (foundMove.color === 'w' &&
          foundMove.piece === 'p' &&
          square[1] === '8') ||
        (foundMove.color === 'b' &&
          foundMove.piece === 'p' &&
          square[1] === '1')
      ) {
        // setShowPromotionDialog(true);
        return;
      }

      // is normal move
      const gameCopy = game;

      const move = gameCopy.move({
        from: moveFrom,
        to: square,
        promotion: 'q',
      });

      if (checkEndGame()) {
        handleEndGame();
      }

      // if invalid, setMoveFrom and getMoveOptions
      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }

      // update chessboard state after player's move
      const fen = game.fen();
      const nextTurn = pieceType === 'white' && isMyTurn ? 'black' : 'white';
      const history = gameCopy.history({ verbose: true });

      let updateMovePiece = {
        fen,
        nextTurn,
        history,
      };

      socket.emit('move piece', { ...updateMovePiece, roomID });

      setGame(gameCopy);
      setMoveFrom('');
      setMoveTo(null);
      setOptionSquares({});

      return;
    }
  }

  // function onPromotionPieceSelect(piece) {
  //   // if no piece passed then user has cancelled dialog, don't make move and reset
  //   if (piece) {
  //     const gameCopy = { ...game };
  //     gameCopy.move({
  //       from: moveFrom,
  //       to: moveTo,
  //       promotion: piece[1].toLowerCase() ?? 'q',
  //     });
  //     setGame(gameCopy);
  //     setTimeout(makeRandomMove, 300);
  //   }

  //   setMoveFrom('');
  //   setMoveTo(null);
  //   // setShowPromotionDialog(false);
  //   setOptionSquares({});
  //   return true;
  // }

  function reset() {
    safeGameMutate((game) => {
      game.reset();
    });
    setEndGame(false);
    setHistories([]);
    setOptionSquares({});
  }

  function movePiece(data) {
    // console.log(data);
    setPieceType((pieceType) => {
      setIsMyTurn(data.nextTurn === pieceType ? true : false);
      return pieceType;
    });

    if (data.fen) {
      const gameCopy = game;
      gameCopy.load(data.fen);
      setGame(gameCopy);
    }

    if (data.history) {
      // set the new fen, next turn, remain time, histories, messages in chat box into roomInfor
      let fen = data.fen;
      let nextTurn = data.nextTurn;
      let histories;
      let roomInfor;
      let state = 'playing';
      setRoomInforCopy((preValue) => {
        roomInfor = preValue;
        return preValue;
      });
      setHistories((preValue) => {
        histories = [...preValue, data.history];
        let newRoomInfor = {
          ...roomInfor,
          fen,
          nextTurn,
          histories,
          state,
        };
        dispath(setRoomInfor(newRoomInfor));
        return histories;
      });
    }
  }

  function getPlayer(source, attribute, value) {
    return source?.player1?.[attribute] === value ? 'player1' : 'player2';
  }

  function playingOptions(option) {
    if (option === 'play online') {
      const infor = {
        messages: 'Please wait for another player...',
        inforButton: {
          animation: 'loading',
          buttonCancel: {
            name: 'Cancel',
            option: 'cancelInvite',
            background: 'green',
          },
        },
      };
      dispath(showMessages(infor));
    }
    socket.emit(option, user);
  }

  function handleOptions(option) {
    // console.log(option);
    switch (option) {
      // hide the dialog end game
      case 'hide dialog':
        setEndGame(false);
        break;

      // accept invite draw
      case 'accept draw invitation':
        handleEndGame(option);
        break;

      // deny the invitation from opponent
      case 'deny draw invitation':
        dispath(showMessages(null));
        socket.emit('deny draw invitation', roomID);
        break;

      // player cancel the invitation
      case 'cancel invitation':
        socket.emit('cancel invitation', roomID);
        dispath(showMessages(null));
        if (roomInfor.state) setEndGame(true);
        break;

      // when user want to play again
      case 'offer rematch game':
        setEndGame(false);
        // set information for dialog message when player wanna reset game
        const infor = {
          messages: 'Waiting For Opponent Reply',
          inforButton: {
            animation: 'loading',
            buttonCancel: {
              name: 'Cancel',
              option: 'cancel invitation',
              background: 'green',
            },
          },
        };
        dispath(showMessages(infor));

        setRoomInforCopy((preValue) => {
          const player = getPlayer(preValue, 'id', user?.id);
          const userName = preValue[player].name;

          const playerInfor = {
            roomID,
            userName,
          };

          socket.emit('offer rematch game', playerInfor);
          return preValue;
        });
        break;

      // accept invite rematch game
      case 'accept rematch invitation':
        socket.emit('handle rematch game', roomID);
        break;

      // deny rematch invitation
      case 'deny rematch invitation':
        setEndGame(true);
        dispath(showMessages(null));
        socket.emit('deny rematch invitation', roomID);
        break;

      // start a new game
      case 'new game':
        dispath(setRoomInfor(null));
        setEndGame(false);
        reset();
        setControllerSide(<TimeOptions playingOptions={playingOptions} />);
        setRoomID((preValue) => {
          socket.emit('start new game', preValue);
          return preValue;
        });
        playingOptions('play online');
        break;

      // review the game
      // case 'gameReview':
      //   break;

      // after opponent denied or received the cancel invitation
      default:
        dispath(showMessages(null));

        if (roomInfor.state) setEndGame(true);
        break;
    }
  }

  function handleFinishGame(option, value = null) {
    // console.log(option);

    // get room's ID
    let roomID;
    setRoomID((preValue) => {
      roomID = preValue;
      return preValue;
    });

    switch (option) {
      case 'offer draw':
        // set information for dialog message when player want to offer a draw
        var infor = {
          messages: 'Waiting For Opponent Reply',
          inforButton: {
            animation: 'loading',
            buttonCancel: {
              name: 'Cancel',
              option: 'cancel invitation',
              background: 'green',
            },
          },
        };
        dispath(showMessages(infor));

        // get user name
        setRoomInforCopy((preValue) => {
          const player = getPlayer(preValue, 'id', user?.id);
          const userName = preValue[player].name;
          const data = {
            roomID,
            userName,
          };
          // console.log(data);
          socket.emit('offer draw', data);
          return preValue;
        });

        break;

      // offer regisn or abort
      case 'offer resign':
      case 'offer abort':
        handleEndGame(option);
        break;

      case 'send message':
        setRoomInforCopy((preValue) => {
          const player = getPlayer(preValue, 'id', user?.id);
          const userName = preValue[player].name;
          let message = `${userName}: ${value}`;

          const data = {
            roomID,
            message,
          };

          socket.emit('send message', data);
          return preValue;
        });

        break;
    }
  }

  return (
    <div className="row align-items-center main_container">
      <div className="col-2">
        <Sidebar />
      </div>

      <div className="col-10">
        <div className="row justify-content-around align-items-center">
          <div className="chessboard col-6 g-0">
            <Chessboard
              id="ClickToMove"
              position={game.fen()}
              boardOrientation={pieceType}
              animationDuration={200}
              arePiecesDraggable={false}
              customBoardStyle={{
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              }}
              customDarkSquareStyle={{ backgroundColor: '#779952' }}
              customLightSquareStyle={{ backgroundColor: '#edeed1' }}
              customSquareStyles={{
                ...optionSquares,
              }}
              onSquareClick={roomInfor && onSquareClick}
              // onPromotionPieceSelect={onPromotionPieceSelect}
              // promotionToSquare={moveTo}
              // showPromotionDialog={showPromotionDialog}
            />

            {/* show dialog end game */}
            {isEndGame && <DialogEndGame handleOptions={handleOptions} />}

            {/* show dialog waiting for reply or invite */}
            {messages && (
              <DialogMessages
                messages={messages && messages.messages}
                infor={messages && messages.inforButton}
                handleOptions={handleOptions}
              />
            )}
          </div>

          {/* section for show players */}
          {roomInfor && (
            <div className="col-1 g-0 players">
              <PlayersSection
                orderOfPlayer={orderOfPlayer}
                pieceType={pieceType}
              />
            </div>
          )}

          {/* controller side */}
          <div className="col-4 g-0 controller_side">
            {controllerSide && controllerSide}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayOnline;
