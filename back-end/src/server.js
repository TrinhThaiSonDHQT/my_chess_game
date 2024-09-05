require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
var cookieParser = require('cookie-parser');

import configViewEngin from './config/viewEngine.js';
import initialMainRoutes from './routes/mainRoutes.js';
import initialApiRoutes from './routes/apiRoutes.js';
import connection from './config/connectDB.js';
import initialSocket from './controller/socket/initialSocket.js';

const app = express();
const port = process.env.PORT || 8080;
const cors = require('cors');

// apply cors package
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['POST', 'GET', 'PUT', 'OPTIONS', 'HEAD'],
    credentials: true,
  })
);
// apply body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// apply cookie-parser
app.use(cookieParser())

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
