import db from '../models/index';

const checkEmail = async (email) => {
  let user = await db.User.findOne({
    where: { email: email },
  });

  if (user != null) return true;
  return false;
};

const checkUsername = async (username) => {
  let user = await db.User.findOne({
    where: { user_name: username },
  });

  if (user != null) return true;
  return false;
};

const checkPassword = async (email, password) => {
  if (password.length >= 6) return true;

  // let user = await db.User.findOne({
  //   where: { email: email },
  // });

  // if (user) {

  // }
  return false;
};

const handleLogin = async (rawData) => {
  try {
    // check email existing, correct password (including contain at leat 6 characters)
    let isExistEmail = await db.User.findAll();

    return {
      EM: 'successful',
      EC: 0,
      DT: rawData.email,
    };
  } catch (error) {
    return {
      EM: 'Error from server',
      EC: 1,
      DT: null,
    };
  }
};

const handleRegister = async (rawData) => {
  try {
    let isExistUsername = await checkUsername(rawData.user_name);
    let isExistEmail = await checkEmail(rawData.email);
    let isCorrectPass = await checkPassword(rawData.email, rawData.password);

    if (isExistUsername === true) {
      return {
        EM: 'Username is exist!',
        EC: 1,
        DT: null,
      };
    }
    if (isExistEmail === true) {
      return {
        EM: 'Email is exist!',
        EC: 1,
        DT: null,
      };
    }

    // check username, email existing, password contain at leat 6 characters
    if (isExistUsername === false && isExistEmail === false && isCorrectPass) {
      return {
        EM: 'successful register',
        EC: 0,
        DT: null,
      };
    } else {
      return {
        EM: 'Failed register!',
        EC: 1,
        DT: null,
      };
    }
  } catch (error) {
    return {
      EM: 'Error from server',
      EC: 1,
      DT: null,
    };
  }
};

module.exports = {
  handleLogin,
  handleRegister,
};
