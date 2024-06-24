import express from 'express';
import apiController from '../controller/apiController';

const router = express.Router();

const initialApiRoutes = (app) => {
  router.post('/login', apiController.login);
  router.post('/register', apiController.register);

  return app.use('/api', router);
};

export default initialApiRoutes;
