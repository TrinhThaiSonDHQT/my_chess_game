import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import "bootstrap/dist/css/bootstrap.min.css";

import PlayingOptions from '../rightSideController/playingOptions/PlayingOptions';

function BoardDefault() {
  const game = new Chess();
  return (
    <div className='row justify-content-around align-items-center h-100'>
      <div className="col-6 g-0 chessboard">
        <Chessboard
          position={game.fen()}
          boardOrientation="white"
          animationDuration={200}
          arePiecesDraggable={false}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
          }}
          customDarkSquareStyle={{ backgroundColor: '#779952' }}
          customLightSquareStyle={{ backgroundColor: '#edeed1' }}
        />
      </div>

      {/* controller side */}
      <div className="col-4 g-0 controller_side">
        <PlayingOptions />
      </div>
    </div>
  );
}

export default BoardDefault;
