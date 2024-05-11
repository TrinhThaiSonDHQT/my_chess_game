import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import BoardDefault from '../../../boards/BoardDefault';
import IPAddress from '../../../../IPAddress';
import Container from '../Container/Container';

const socket = io.connect(`http://${IPAddress}:3001`);

function HomePage() {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // check the current state of players when they reconnecting
      const data = {
        userID: user._id,
        page: 'home page',
      };
      socket.emit('handleCurrentState', data);
    }
  }, [user]);

  useEffect(() => {
    // on receive status
    socket.on('status', (data) => {
      navigate(data);
    });
  }, [socket]);

  return (
    <Container>
      <BoardDefault />
    </Container>
  );
}

export default HomePage;
