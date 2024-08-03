// import { io } from 'socket.io-client';
// import { useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import BoardDefault from '../../../boards/BoardDefault';
import Container from '../../../Container/Container';
import { showMessages, setRoomInfor } from '../../../../redux/gameSlice';

// const socket = io.connect(`http://${IPAddress}:3001`);
function HomePage() {
  const dispath = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispath(setRoomInfor(null));
    dispath(showMessages(null));
    navigate('/play/online');
  }, []);
  // const user = useSelector((state) => state.auth.login?.currentUser);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (user) {
  //     // check the current state of players when they reconnecting
  //     const data = {
  //       userID: user._id,
  //       page: 'home page',
  //     };
  //     socket.emit('handleCurrentState', data);
  //   }
  // }, [user]);

  // useEffect(() => {
  //   // on receive status
  //   socket.on('status', (data) => {
  //     navigate(data);
  //   });
  // }, [socket]);

  // useEffect(() => {
  //   const params = {
  //     fen: 'rnbqkbnr/p1pppppp/1p6/8/8/6P1/PPPPPPBP/RNBQK1NR b KQkq - 1 2',
  //     depth: 10,
  //     mode: 'bestmove'
  //   };

  //   axios
  //     .get(`https://stockfish.online/api/stockfish.php`, { params })
  //     .then((res) => {
  //       console.log(res.data.data);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);

  return (
    <Container>
      <BoardDefault />
    </Container>
  );
}

export default HomePage;
