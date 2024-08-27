require('dotenv').config();
import jwt from 'jsonwebtoken';

const privateKey = process.env.PRIVATE_KEY;
const createJWT = (data) => {
  return jwt.sign({ data }, privateKey);
};

const checkJWT = (accessToken) => {
  return jwt.verify(accessToken, privateKey);
};

export default {
  createJWT,
  checkJWT
};
