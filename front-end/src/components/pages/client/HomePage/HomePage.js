import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import axios from 'axios';

import BoardDefault from '../../../boards/BoardDefault';
import Container from '../../../Container/Container';
import { showMessages, setRoomInfor } from '../../../../redux/gameSlice';

function HomePage() {
  const dispath = useDispatch();
  useEffect(() => {
    dispath(showMessages(null));
    dispath(setRoomInfor(null));
  }, []);

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
