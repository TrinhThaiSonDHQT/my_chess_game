import express from 'express';
import homeController from '../controller/homeController';

const router = express.Router();

const initialMainRoutes = (app) => {
  router.get('/', homeController.homePage);
  return app.use('/', router);
};

export default initialMainRoutes;