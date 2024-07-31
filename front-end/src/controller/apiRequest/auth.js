import axiosInstance from '../../axios/axiosInstance';
import {
  loginFailed,
  logoutStart,
  logoutSuccess,
  logoutFailed,
} from '../../redux/authSlice';

export const login = async (user, dispatch, navigate) => {
  try {
    const res = await axiosInstance.post('api/login', user);
    return res;
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
  try {
    dispatch(logoutSuccess());
    navigate('/');
  } catch (error) {
    dispatch(logoutFailed());
  }
};

