import axiosInstance from '../axios/axiosInstance';
import {
  loginStart,
  loginSuccess,
  loginFailed,
  registerStart,
  registerSuccess,
  logoutStart,
  logoutSuccess,
  logoutFailed,
} from '../redux/authSlice';

export const login = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axiosInstance.post('api/login', user);

    if (res && res.EC === 0) {
      dispatch(loginSuccess(res.DT));
      navigate('/');
    } else {
      dispatch(loginFailed());
    }
  } catch (error) {
    dispatch(loginFailed());
  }
};

export const register = async (user, dispatch) => {
  try {
    const res = await axiosInstance.post('api/register', user);
    return res;
  } catch (error) {
    dispatch(loginFailed());
  }
};

export const logout = (dispatch, navigate) => {
  dispatch(logoutStart());
  dispatch(logoutSuccess());
  navigate("/home");
  // try {
  //   dispatch(logoutSuccess());
  //   navigate('/');
  // } catch (error) {
  //   dispatch(logoutFailed());
  // }
};
