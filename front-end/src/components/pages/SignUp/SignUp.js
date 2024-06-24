import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../SignIn/SignIn.module.scss';
import styles from '../SignIn/SignIn.module.scss';
import logo from '../../../images/chess-game-logo.png';
import { register } from '../../../controller/apiRequest';
import {
  registerFailed,
  registerStart,
  registerSuccess,
} from '../../../redux/authSlice';
import { doubleCheckPass } from '../../../controller/validation';

function SignUp() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showError, setShowError] = useState('');

  const dispath = useDispatch();
  const navigate = useNavigate();

  const showHidePasswordRef = useRef();
  const showHidePasswordRef2 = useRef();

  // show hide password
  function handleShowHidePassword(option = null) {
    if (option === 'doubleCheckPass') {
      setShowPassword2((preValue) => {
        if (preValue === false) showHidePasswordRef2.current.type = 'text';
        else showHidePasswordRef2.current.type = 'password';

        return preValue === true ? false : true;
      });
    } else {
      setShowPassword((preValue) => {
        if (preValue === false) showHidePasswordRef.current.type = 'text';
        else showHidePasswordRef.current.type = 'password';

        return preValue === true ? false : true;
      });
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();

    if (doubleCheckPass(password, password2)) {
      dispath(registerStart());

      const newUser = {
        user_name: userName,
        email: email,
        password: password,
      };
      let res = await register(newUser, dispath);

      if (res) {
        if (res.EC === 1) {
          setShowError(res.EM);
          dispath(registerFailed());
        } else {
          setShowError('');
          dispath(registerSuccess());
          
          toast.success('Successfully register', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
        }
      } else dispath(registerFailed());
    } else {
      setShowError('Re-enter password is not correct!');
    }
  }

  return (
    <>
      <div className={styles.formContainer}>
        <div className={styles.logo}>
          <a href="/">
            <img src={logo} alt="logo" />
          </a>
        </div>

        <div className={styles.formComponent}>
          <form onSubmit={handleSignUp}>
            {/* username */}
            <div className={styles.inputGroup}>
              <span className={styles.inputGroupIcon}>
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input
                className={styles.inputGroupInput}
                placeholder="Username"
                type="text"
                value={userName && userName}
                required
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            {/* email */}
            <div className={styles.inputGroup}>
              <span className={styles.inputGroupIcon}>
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <input
                className={styles.inputGroupInput}
                placeholder="Email"
                type="email"
                value={email && email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* password */}
            <div className={styles.inputGroup}>
              <span className={styles.inputGroupIcon}>
                <FontAwesomeIcon icon={faLock} />
              </span>
              <div className={styles.inputGroupPassword}>
                <input
                  className={styles.inputGroupInput}
                  placeholder="Password"
                  type="password"
                  required
                  value={password && password}
                  ref={showHidePasswordRef}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className={styles.inputGroupIcon}
                  onClick={() => handleShowHidePassword()}
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon={faLock} />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </span>
              </div>
            </div>

            {/* double check password */}
            <div className={styles.inputGroup}>
              <span className={styles.inputGroupIcon}>
                <FontAwesomeIcon icon={faLock} />
              </span>
              <div className={styles.inputGroupPassword}>
                <input
                  className={styles.inputGroupInput}
                  placeholder="Re-enter password"
                  type="password"
                  value={password2 && password2}
                  ref={showHidePasswordRef2}
                  onChange={(e) => setPassword2(e.target.value)}
                />
                <span
                  className={styles.inputGroupIcon}
                  onClick={() => handleShowHidePassword('doubleCheckPass')}
                >
                  {showPassword2 ? (
                    <FontAwesomeIcon icon={faLock} />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </span>
              </div>
            </div>

            {/* show error */}
            <div className={styles.showError}>{showError}</div>

            {/* button log in */}
            <button className={styles.btnLogin} type="submit">
              Sign Up
            </button>
          </form>

          {/* login */}
          <a className={styles.register} href="/login">
            <span>You already have an account - Sign In!</span>
          </a>
        </div>
      </div>

      {/* toasty */}
      <ToastContainer />
    </>
  );
}

export default SignUp;
