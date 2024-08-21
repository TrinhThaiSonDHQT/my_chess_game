import { Routes, Route } from 'react-router-dom';

import HomePage from './components/pages/HomePage/HomePage';
import SignUp from './components/pages//SignUp/SignUp';
import SignIn from './components/pages/SignIn/SignIn';
import PlayOnline from './components/pages/PlayOnline/PlayOnline';
import PlayWithComputer from './components/pages/PlayWithComputer/PlayWithComputer';

function App() {
  return (
    <Routes>
      {/* home page - default */}
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />

      {/* authentication */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} />

      {/* play online / with computer / with a friend */}
      <Route path="/play/online" element={<PlayOnline />} />
      <Route path="/play/computer" element={<PlayWithComputer />} />
      <Route path="/play/friend" element={<HomePage />} />
    </Routes>
  );
}

export default App;
