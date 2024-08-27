import express from 'express';
import apiController from '../controller/apiController.js';

const router = express.Router();

const initialApiRoutes = (app) => {
  router.post('/login', apiController.login);
  router.post('/logout', apiController.checkUserJWT, apiController.logout);
  router.post('/register', apiController.register);
  router.post('/playonline', apiController.checkUserJWT, apiController.playOnline);

  return app.use('/api', router);
};

export default initialApiRoutes;
