import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

import './BoardDefault.css';
import PlayingOptions from '../rightSideController/playingOptions/PlayingOptions';
import logo from '../../images/chess-game-logo.png';
import Sidebar from '../sidebar/Sidebar';

function BoardDefault() {
  const [showMenu, setShowMenu] = useState(false);
  const game = new Chess();
  const menuRef = useRef();
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      {showMenu && (
        <div className='menu'>
          {/* turn off menu */}
          <div className='menu__icon'>
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

      {/* chess board */}
      <div className="row justify-content-around align-items-lg-center align-items-start">
        <div className="chessboard col-6 g-0">
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
    </>
  );
}

export default BoardDefault;
