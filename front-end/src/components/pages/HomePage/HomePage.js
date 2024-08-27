import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import BoardDefault from '../../boards/BoardDefault';
import Container from '../../Container/Container';
import { showMessages, setRoomInfor } from '../../../redux/gameSlice';

function HomePage() {
  const roomInforRedux = useSelector((state) => state.game.roomInfor);
  const dispath = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (roomInforRedux != null) {
      // if the game hasn't finished then re-direct to play online page
      // else reset redux
      if (roomInforRedux.state !== 'finish') {
        navigate('/play/online');
      } else {
        dispath(showMessages(null));
        dispath(setRoomInfor(null));
      }
    }
  }, []);

  return (
    <Container>
      <BoardDefault />
    </Container>
  );
}

export default HomePage;
