import { handleLogin, handleRegister } from '../service/auth';

const login = async (req, res) => {
  try {
    let results = await handleLogin(req.body);
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
    let results = await handleRegister(req.body);
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

export default {
  login,
  register,
};
