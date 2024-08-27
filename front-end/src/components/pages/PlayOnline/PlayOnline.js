import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import io from 'socket.io-client';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import '../../Container/Container.css';
import '../../boards/BoardDefault.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import logo from '../../../images/chess-game-logo.png';
import DialogEndGame from '../../dialogEndGame/DialogEndGame';
import DialogMessages from '../../dialogMessages/DialogMessages';
import TimeOptions from '../../rightSideController/timeOptions/TimeOptions';
import Sidebar from '../../sidebar/Sidebar';
import HistoriesAndChats from '../../rightSideController/HistoriesAndChats/HistoriesAndChats';
import PlayersSection from '../../players/PlayersSection';
import { showMessages, setRoomInfor } from '../../../redux/gameSlice';
import axios from '../../../axios/axiosInstance';

const socket = io.connect(`http://${process.env.REACT_APP_IP_ADDRESS}:3001`);
var roomID;
var moveFrom;
var moveTo;
var playerOrder;
var roomInfor;
var isMyTurn;
var histories = [];

function PlayOnline() {
  const [game, setGame] = useState(new Chess());
  const [optionSquares, setOptionSquares] = useState({});
  const [isEndGame, setEndGame] = useState(false);
  const [pieceType, setPieceType] = useState(null);
  const [controllerSide, setControllerSide] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  const dispath = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const messages = useSelector((state) => state.game.messages);
  const roomInforRedux = useSelector((state) => state.game.roomInfor);

  useEffect(() => {
    checkUserJWT();

    // handle when players reconnect or update new information
    if (roomInforRedux != null) {
      setInforToPlayer(roomInforRedux);
      socket.emit('re-connect', roomInforRedux.roomID);
    } else {
      setControllerSide(<TimeOptions playingOptions={playingOptions} />);
    }
  }, []);

  useEffect(() => {
    if (roomInforRedux != null) {
      roomInfor = roomInforRedux;
    }
  }, [roomInforRedux]);

  useEffect(() => {
    // on start game
    socket.on('start game', (data) => {
      // console.log(data);
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
      let messages = [...roomInfor.messages, message];
      let newRoomInfor = { ...roomInfor, messages };
      dispath(setRoomInfor(newRoomInfor));
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
      dispath(showMessages(null));
      reset();
      setPieceType((preValue) => {
        let type = preValue === 'white' ? 'black' : 'white';
        isMyTurn = type === 'white' ? true : false;
        return type;
      });
      let player1 = { ...roomInfor['player1'] };
      let player2 = { ...roomInfor['player2'] };
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
        ...roomInfor,
        player1,
        player2,
        nextTurn,
        state,
      };
      dispath(setRoomInfor(newRoomInfor));
    });
  }, [socket]);

  const checkUserJWT = async () => {
    try {
      await axios.post('api/playonline');
    } catch (error) {
      // direct to login page if the player still not authenticate
      navigate('/login');
      return;
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  function setInforToPlayer(data) {
    // console.log(data);
    roomInfor = data;
    roomID = data.roomID;

    // determine this player is 'player1' or 'player2'
    let player = getPlayer(data, 'id', user?.id);
    setPieceType(data[player].pieceType);
    playerOrder = player;
    movePiece(data);
    setControllerSide(
      <HistoriesAndChats handleFinishGame={handleFinishGame} />
    );
    if (data.state === 'finish') {
      setEndGame(true);
    }
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
    dispath(showMessages(null));
    setEndGame(true);

    let pieceType;
    setPieceType((preValue) => {
      pieceType = preValue;

      var newRoomInfor = { ...roomInfor };
      newRoomInfor.state = 'finish';
      if (option === 'accept draw invitation')
        newRoomInfor.pieceTypeWon = 'draw game';
      else {
        let playerWon;
        if (option === 'offer resign' || option === 'offer abort') {
          // if the player who is resigned or aborted then he/she will be a loseer
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
  }

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
      if (hasMoveOptions) moveFrom = square;
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
        moveFrom = hasMoveOptions ? square : '';
        return;
      }

      // valid move
      moveTo = square;

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

      // finish game if it can
      if (checkEndGame()) {
        handleEndGame();
      }

      // if invalid, setMoveFrom and getMoveOptions
      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) moveFrom = square;
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

      // reset state of chess board
      setGame(gameCopy);
      moveFrom = '';
      moveTo = '';
      setOptionSquares({});
      return;
    }
  }

  function reset() {
    safeGameMutate((game) => {
      game.reset();
    });
    setEndGame(false);
    histories = [];
    setOptionSquares({});
  }

  function movePiece(data) {
    // console.log(data);
    setPieceType((pieceType) => {
      isMyTurn = data.nextTurn === pieceType ? true : false;
      return pieceType;
    });
    if (data.fen) {
      const gameCopy = game;
      gameCopy.load(data.fen);
      setGame(gameCopy);
    }
    if (data.history) {
      // set the new fen, next turn, remain time, histories, messages in chat box into roomInforRedux
      let fen = data.fen;
      let nextTurn = data.nextTurn;
      let state = 'playing';
      histories = [...histories, data.history];
      let newRoomInfor = {
        ...roomInfor,
        fen,
        nextTurn,
        histories,
        state,
      };
      dispath(setRoomInfor(newRoomInfor));
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

  const handleOptions = useCallback((option) => {
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
        if (roomInforRedux?.state === 'finish') setEndGame(true);
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

        const player = getPlayer(roomInfor, 'id', user?.id);
        const userName = roomInfor[player].name;

        const playerInfor = {
          roomID,
          userName,
        };

        socket.emit('offer rematch game', playerInfor);
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
        socket.emit('start new game', roomID);
        playingOptions('play online');
        break;

      // review the game
      // case 'gameReview':
      //   break;

      // after opponent denied or received the cancel invitation
      default:
        dispath(showMessages(null));
        if (roomInforRedux?.state === 'finish') setEndGame(true);
        break;
    }
  }, []);

  const handleFinishGame = useCallback((option, value = null) => {
    // console.log(option);
    // get user name
    let player = getPlayer(roomInfor, 'id', user?.id);
    let userName = roomInfor[player].name;
    let data = {};

    switch (option) {
      // offer draw
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
        data = {
          roomID,
          userName,
        };
        // console.log(data);
        socket.emit('offer draw', data);
        break;

      // offer regisn or abort
      case 'offer resign':
      case 'offer abort':
        handleEndGame(option);
        break;

      // send message
      case 'send message':
        let message = `${userName}: ${value}`;
        data = {
          roomID,
          message,
        };
        socket.emit('send message', data);
        break;
    }
  }, []);

  return (
    <div className="main-container row align-items-center">
      <div className="col-2 d-lg-block d-none">
        <Sidebar />
      </div>

      <div className="col-lg-10 col-12">
        {showMenu && (
          <div className="menu">
            {/* turn off menu */}
            <div className="menu__icon">
              <FontAwesomeIcon
                icon={faXmark}
                size="2xl"
                style={{ color: '#989795', cursor: 'pointer' }}
                onClick={toggleMenu}
                ref={menuRef}
              />
            </div>

            <div>
              <Sidebar />
            </div>
          </div>
        )}

        {/* show menu */}
        <div
          className="d-lg-none p-2 d-flex align-items-center"
          style={{ backgroundColor: 'rgb(44, 43, 41)' }}
        >
          <FontAwesomeIcon
            icon={faBars}
            size="2xl"
            style={{
              color: '#989795',
              marginRight: '10px',
              cursor: 'pointer',
            }}
            onClick={toggleMenu}
            ref={menuRef}
          />

          <div>
            <a href="/">
              <img
                src={logo}
                alt="logo"
                style={{ width: '125px', objectFit: 'cover' }}
              />
            </a>
          </div>
        </div>

        <div className="row justify-content-around align-items-lg-center align-items-start">
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
              onSquareClick={roomInforRedux && onSquareClick}
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
          {playerOrder && roomInforRedux && pieceType && (
            <div className="col-1 g-0 players">
              <PlayersSection playerOrder={playerOrder} pieceType={pieceType} />
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
