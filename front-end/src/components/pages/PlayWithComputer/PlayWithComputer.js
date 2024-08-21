import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

import Sidebar from '../../sidebar/Sidebar';

const PlayWithComputer = () => {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState('');
  const [moveTo, setMoveTo] = useState(null);
  const [optionSquares, setOptionSquares] = useState({});

  // function safeGameMutate(modify) {
  //   setGame((g) => {
  //     const update = g;
  //     modify(update);
  //     return update;
  //   });
  // }

  async function makeRandomMove(square) {
    const possibleMoves = game.moves();

    // exit if the game is over
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
      return;

    const params = {
      fen: game.fen(),
      depth: 10,
      mode: 'bestmove',
    };

    await axios
      .get(`https://stockfish.online/api/stockfish.php`, { params })
      .then((res) => {
        let data = res.data.data.split(' ');
        let moveFrom = data[1].slice(0, 2);
        let moveTo = data[1].slice(2, 4);

        let gameCopy = game;
        const move = gameCopy.move({
          from: moveFrom,
          to: moveTo,
          promotion: 'q',
        });
        if (move === null) {
          const hasMoveOptions = getMoveOptions(square);
          if (hasMoveOptions) setMoveFrom(square);
          return;
        }

        setGame(gameCopy);
        setMoveFrom('');
        setMoveTo(null);
        setOptionSquares({});
      })
      .catch((error) => console.log(error));
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
    if (game.turn() === 'b') return;

    const squareObject = game.get(square);
    // if this square contain a piece
    if (squareObject) {
      const pieceColor = squareObject.color;
      // prevent player from click on piece's opponent
      // howerver, when you want to attack to piece's opponent that is valid
      if (pieceColor === 'b') {
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

      // if (checkEndGame()) {
      //   handleEndGame();
      // }

      // if invalid, setMoveFrom and getMoveOptions
      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }

      setGame(gameCopy);
      setMoveFrom('');
      setMoveTo(null);
      setOptionSquares({});

      makeRandomMove(square);

      return;
    }
  }

  // function onDrop(sourceSquare, targetSquare, piece) {
  //   const gameCopy = game;
  //   const move = gameCopy.move({
  //     from: sourceSquare,
  //     to: targetSquare,
  //     promotion: piece[1].toLowerCase() ?? 'q',
  //   });
  //   setGame(gameCopy);

  //   // illegal move
  //   if (move === null) return false;

  //   // store timeout so it can be cleared on undo/reset so computer doesn't execute move
  //   const newTimeout = setTimeout(makeRandomMove, 100);
  //   setCurrentTimeout(newTimeout);
  //   return true;
  // }

  return (
    <div className="row align-items-center main_container">
      <div className="col-2">
        <Sidebar />
      </div>

      <div className="col-10">
        <div className="row justify-content-around align-items-center">
          <div className="chessboard col-6">
            <Chessboard
              id="ClickToMove"
              position={game.fen()}
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
              onSquareClick={onSquareClick}
            />

            {/* show dialog end game */}
            {/* {isEndGame && <DialogEndGame handleOptions={handleOptions} />} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayWithComputer;
