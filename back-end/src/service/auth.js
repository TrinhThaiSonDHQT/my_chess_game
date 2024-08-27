import db from '../models/index.js';

const bcrypt = require('bcryptjs');

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

const checkPassword = (userInputPassword, hashedPassword) => {
  let isCorrectPass = bcrypt.compareSync(userInputPassword, hashedPassword);
  if (userInputPassword.length >= 6 && isCorrectPass) return true;

  return false;
};

const handleLogin = async (rawData) => {
  try {
    let user = await db.User.findOne({
      where: { email: rawData.email },
    });

    if (user) {
      let isCorrectPass = checkPassword(rawData.password, user.password);
      if (isCorrectPass) {
        delete user.dataValues.password;
        delete user.dataValues.createdAt;
        delete user.dataValues.updatedAt;
        
        return {
          EM: 'Login successfully',
          EC: 0,
          DT: user.dataValues,
        };
      }
    }

    return {
      EM: 'Email or password is invalid!',
      EC: 1,
      DT: null,
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
    if (
      isExistUsername === false &&
      isExistEmail === false &&
      rawData.password.length >= 6
    ) {
      // insert new user
      let salt = bcrypt.genSaltSync(10);
      let hashedPassword = bcrypt.hashSync(rawData.password, salt);

      if (hashedPassword) {
        await db.User.create({
          user_name: rawData.user_name,
          email: rawData.email,
          password: hashedPassword,
          id_group: 3,
        });
      }

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

export default{
  handleLogin,
  handleRegister,
};
