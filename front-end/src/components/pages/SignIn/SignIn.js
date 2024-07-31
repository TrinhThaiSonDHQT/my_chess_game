import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';

import styles from './SignIn.module.scss';
import logo from '../../../images/chess-game-logo.png';
import { login } from '../../../controller/apiRequest/auth';
import { isValiPass } from '../../../controller/validation';
import {
  loginFailed,
  loginStart,
  loginSuccess,
} from '../../../redux/authSlice';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState('');
  const showHidePasswordRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // show hide password
  function handleShowHidePassword() {
    setShowPassword((preValue) => {
      if (preValue === false) showHidePasswordRef.current.type = 'text';
      else showHidePasswordRef.current.type = 'password';

      return preValue === true ? false : true;
    });
  }

  const handleLogin = async (e) => {
    // prevent reload page from logging in
    e.preventDefault();

    if (isValiPass(password)) {
      setShowError('');
      dispatch(loginStart());

      const newUser = {
        email: email,
        password: password,
      };

      let res = await login(newUser, dispatch, navigate);
      if (res) {
        if (res.EC === 1) {
          setShowError(res.EM);
          dispatch(loginFailed());
        } else {
          setShowError('');
          dispatch(loginSuccess(res.DT));
          navigate('/');
        }
      } else dispatch(loginFailed());
    } else {
      setShowError('Email or password is invalid');
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.logo}>
        <a href="/">
          <img src={logo} alt="logo" />
        </a>
      </div>

      <div className={styles.formComponent}>
        <form onSubmit={handleLogin}>
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
          {/* show error */}
          <div className={styles.showError}>{showError}</div>

          {/* remember password / forget password */}
          <div className={styles.rememberForgetPassword}>
            <div className={styles.rememberPassword}>
              <input type="checkbox" id="rememberPassword" />
              <label htmlFor="rememberPassword">Remember me</label>
            </div>

            <div className={styles.forgetPassword}>
              <a href="#">Forgot Password?</a>
            </div>
          </div>

          {/* button log in */}
          <button className={styles.btnLogin} type="submit">
            Log In
          </button>
        </form>

        {/* register */}
        <a className={styles.register} href="/signup">
          <span>Sign Up - and start playing chess!</span>
        </a>
      </div>
    </div>
  );
}

export default SignIn;
