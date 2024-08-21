import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake, faStar } from '@fortawesome/free-regular-svg-icons';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import './Sidebar.scss';
import logo from '../../images/chess-game-logo.png';
import avatar from '../../images/default-avatar.jpg';
// import { createAxios } from '../../redux/createInstance';
// import { logoutUser } from '../../redux/apiRequest';
// import { loginSuccess } from '../../redux/authSlice';
import { logout } from '../../controller/apiRequest/auth';

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login?.currentUser);
  // const idUser = user?._id;

  function handleLogout() {
    // logoutUser(idUser, user?.accessToken, dispatch, navigate, axiosJWT);
    logout(dispatch, navigate);
  }

  return (
    <div className="side-bar">
      <a className="side-bar__link" href="/">
        <img src={logo} alt="logo" />
      </a>
      <a className="side-bar__link" href="/play/online">
        <span>
          <FontAwesomeIcon icon={faHandshake} />
        </span>
        <span className="text"> Play</span>
      </a>
      <a className="side-bar__link" href="/review">
        <span className="rounded">
          <FontAwesomeIcon icon={faStar} />
        </span>
        <span className="text">Review</span>
      </a>
      <a className="side-bar__link" href="/learn">
        <span>
          <FontAwesomeIcon icon={faGraduationCap} />
        </span>
        <span className="text">Learn</span>
      </a>
      {user ? (
        <>
          <a className="side-bar__profile" href="/profile">
            <img src={avatar} alt="profile" />
            <span className="side-bar__profile-name">{user.user_name}</span>
          </a>
          <a className="side-bar__link sign-up" onClick={handleLogout}>
            Log Out
          </a>
        </>
      ) : (
        <>
          <a className="side-bar__link button sign-up" href="/signup">
            Sign Up
          </a>
          <a className="side-bar__link button log_in" href="/login">
            Log In
          </a>
        </>
      )}
    </div>
  );
}

export default Sidebar;
