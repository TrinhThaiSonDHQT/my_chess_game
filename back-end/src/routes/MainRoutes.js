import express from 'express';
import homeController from '../controller/homeController.js';

const router = express.Router();

// used for admin
const initialMainRoutes = (app) => {
  router.get('/', homeController.homePage);
  router.get('/login', homeController.login);

  return app.use('/', router);
};

export default initialMainRoutes;