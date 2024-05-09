import express from 'express';
import homeController from '../controller/homeController';

const router = express.Router();

const initialMainRoutes = (app) => {
  router.get('/', homeController.homePage);
  router.get('/login', homeController.login);

  return app.use('/', router);
};

export default initialMainRoutes;