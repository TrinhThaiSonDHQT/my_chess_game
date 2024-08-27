import auth from '../service/auth.js';
import jwt from './jwt.js';

const login = async (req, res) => {
  try {
    var results = await auth.handleLogin(req.body);
    const accessToken = jwt.createJWT(results.DT);
    res.cookie('accessToken', accessToken, { httpOnly: true });
    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  }
};

const register = async (req, res) => {
  try {
    var results = await auth.handleRegister(req.body);
    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  }
};

const checkUserJWT = (req, res, next) => { 
  let accessToken = req.cookies['accessToken'];
  if (accessToken) {
    let decode = jwt.checkJWT(accessToken);
    if (decode) {
      next();
    } else {
      return res.status(401).json({
        EM: "User haven't been authenticated!",
        EC: 1,
        DT: null,
      });
    }
  } else {
    return res.status(401).json({
      EM: "User haven't been authenticated!",
      EC: 1,
      DT: null,
    });
  }
};

const playOnline = (req, res) => {
  return res.status(200).json({
    EM: 'User have been authenticated',
    EC: 0,
    DT: req.body,
  });
};

const logout = (req, res) => {
  res.clearCookie('accessToken');
  return res.status(200).json({
    EM: 'User logout successfully!',
    EC: 0,
    DT: null,
  })
}

export default {
  login,
  register,
  checkUserJWT,
  playOnline,
  logout
};
