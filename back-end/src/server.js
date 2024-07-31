require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';

import configViewEngin from './config/viewEngine';
import initialMainRoutes from './routes/mainRoutes';
import initialApiRoutes from './routes/apiRoutes';
import connection from './config/connectDB';
import initialSocket from './controller/socket/initialSocket';

const app = express();
const port = process.env.PORT || 8080;
const cors = require('cors');

// apply cors package
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

// apply body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect to database
connection();

// initial view engine
configViewEngin(app);

// initial main routes
initialMainRoutes(app);
// initial api routes
initialApiRoutes(app);

// initial socket
initialSocket(app);

app.listen(port, () => {
  console.log('server is running...');
});
