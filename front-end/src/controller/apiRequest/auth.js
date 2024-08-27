import {
  loginFailed,
  logoutStart,
  logoutSuccess,
  logoutFailed,
} from '../../redux/authSlice';
import axios from '../../axios/axiosInstance';

export const login = async (user, dispatch) => {
  try {
    const res = await axios.post('api/login', user);
    return res;
  } catch (error) {
    // console.log(error);
    dispatch(loginFailed());
  }
};

export const register = async (user, dispatch) => {
  try {
    const res = await axios.post('api/register', user);
    return res;
  } catch (error) {
    dispatch(loginFailed());
  }
};

export const logout = async (dispatch, navigate) => {
  dispatch(logoutStart());
  try {
    const res = await axios.post('api/logout');
    if (res && res.EC === 0) {
      dispatch(logoutSuccess());
      navigate('/');
    }
  } catch (error) {
    dispatch(logoutFailed());
  }
};

export const checkJWT = async (accessToken) => {
  try {
    const res = await axios.post('api/checkJWT', accessToken);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const refreshToken = async (user) => {
  try {
    const res = await axios.post('api/refreshToken', user);
    return res;
  } catch (error) {
    // console.log(error);
  }
};
