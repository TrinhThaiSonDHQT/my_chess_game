import { useSelector } from 'react-redux';
import { memo } from 'react';

import './DialogEndGame.css';
import defAvatar from '../../images/default-avatar.jpg';
import CustomButton from '../buttons/CustomButton';

function DialogEndGame({ handleOptions }) {
  const roomInfor = useSelector((state) => state.game.roomInfor);

  return (
    <div className="dialogEndGame">
      <span className="btn-exit" onClick={() => handleOptions('hide dialog')}>
        X
      </span>

      <p className="dialogEndGame_title">
        {roomInfor?.pieceTypeWon === 'draw game'
          ? roomInfor?.pieceTypeWon
          : `${roomInfor?.pieceTypeWon} win!`}
      </p>

      <div className="dialogEndGame_players">
        <div className="players_infor">
          <div
            className={`players_infor-avatar ${
              roomInfor?.player1?.isWon &&
              roomInfor?.pieceTypeWon !== 'draw game'
                ? 'player_win'
                : ''
            }`}
          >
            <img src={defAvatar} alt="avatar user" />
          </div>
          <div className="players_infor-name">{roomInfor?.player1?.name}</div>
        </div>

        <span style={{ fontSize: '18px', fontWeight: '500', color: 'white' }}>
          VS
        </span>

        <div className="players_infor">
          <div
            className={`players_infor-avatar ${
              roomInfor?.player2?.isWon &&
              roomInfor?.pieceTypeWon !== 'draw game'
                ? 'player_win'
                : ''
            }`}
          >
            <img src={defAvatar} alt="avatar user" />
          </div>
          <div className="players_infor-name">{roomInfor?.player2?.name}</div>
        </div>
      </div>

      <div className="dialogEndGame_finish-game">
        <button
          className="btn-game-review"
          onClick={() => handleOptions('game review')}
        >
          Game Review
        </button>

        <div className="buttons_finish-game">
          <CustomButton
            name="New 10 min"
            bg="dark"
            onEventClick={handleOptions}
            option="new game"
          />

          <CustomButton
            name="Rematch"
            bg="dark"
            onEventClick={handleOptions}
            option="offer rematch game"
          />
        </div>
      </div>
    </div>
  );
}

export default memo(DialogEndGame);
