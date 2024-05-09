import express from 'express';
require('dotenv').config();
import configViewEngin from './config/viewEngine';
import initialMainRoutes from './routes/MainRoutes';

const app = express();
const port = process.env.PORT || 8080;

// initial view engine
configViewEngin(app);
// initial main routes
initialMainRoutes(app);

app.listen(port, () => {
  console.log('server is running...');
});
