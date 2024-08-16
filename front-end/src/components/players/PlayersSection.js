import { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import './PlayersSection.css';
import defAvatar from '../../images/default-avatar.jpg';

let interval;
function PlayersSection({ playerOrder, pieceType }) {
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutesOpp, setMinutesOpp] = useState(0);
  const [secondsOpp, setSecondsOpp] = useState(0);
  const roomInfor = useSelector((state) => state.game.roomInfor);

  useEffect(() => {
    if (roomInfor) {
      if (roomInfor.state === 'new game') {
        setMinutes(10);
        setSeconds(0);
        setMinutesOpp(10);
        setSecondsOpp(0);
      } else if (roomInfor.state === 'finish') {
        stopTimer();
        return;
      }
      setIsMyTurn(pieceType === roomInfor.nextTurn ? true : false);
    }
  }, [roomInfor, pieceType]);

  // coutdown timer
  useEffect(() => {
    // coutdown the time of player
    if (isMyTurn) {
      interval = setInterval(() => {
        if (Number(seconds) > 0) setSeconds((preValue) => Number(preValue) - 1);
        else if (Number(minutes) > 0) {
          setMinutes((preValue) => Number(preValue) - 1);
          setSeconds(59);
        }
      }, 1000);
      if (Number(seconds) === 0 && Number(minutes === 0)) stopTimer();
    } else {
      // coutdown the time of opponent
      interval = setInterval(() => {
        if (Number(secondsOpp) > 0)
          setSecondsOpp((preValue) => Number(preValue) - 1);
        else if (Number(minutesOpp) > 0) {
          setMinutesOpp((preValue) => Number(preValue) - 1);
          setSecondsOpp(59);
        }
      }, 1000);
      if (Number(secondsOpp) === 0 && Number(minutesOpp === 0)) stopTimer();
    }

    return () => clearInterval(interval);
  }, [isMyTurn, minutes, seconds, minutesOpp, secondsOpp]);

  function stopTimer() {
    clearInterval(interval);
  }

  return (
    <div className="players">
      <div className="player_infor">
        <div className="player_infor-avatar">
          <img src={defAvatar} alt="avatar" />
        </div>
        <div>
          <div className="player_infor-name">
            <span>
              {playerOrder === 'player1'
                ? roomInfor?.['player2']?.name
                : roomInfor?.['player1']?.name}
            </span>
          </div>
          <div className={`time ${isMyTurn ? 'onPause' : 'onPlay'}`}>{`${
            minutesOpp < 10 ? String(minutesOpp).padStart(2, '0') : minutesOpp
          } : ${
            secondsOpp < 10 ? String(secondsOpp).padStart(2, '0') : secondsOpp
          }`}</div>
        </div>
      </div>

      <div className="player_infor">
        <div className="player_infor-avatar">
          <img src={defAvatar} alt="avatar" />
        </div>
        <div>
          <div className={`time ${isMyTurn ? 'onPlay' : 'onPause'}`}>{`${
            minutes < 10 ? String(minutes).padStart(2, '0') : minutes
          } : ${
            seconds < 10 ? String(seconds).padStart(2, '0') : seconds
          }`}</div>
          <div className="player_infor-name">
            <span>
              {playerOrder === 'player1'
                ? roomInfor?.['player1']?.name
                : roomInfor?.['player2']?.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(PlayersSection);
