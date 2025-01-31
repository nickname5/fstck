const express = require('express');
const cors = require('cors');
const passport = require('passport');
const config = require('./config/config');
const morgan = require('./config/morgan');
const routes = require('./routes');
const { errorConverter, errorHandler } = require('./middleware/error');
const ApiError = require('./utils/ApiError');

const app = express();

require('./auth/passport');

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors()); // todo: make login through gateway and remove cors here
app.options('*', cors());

app.use(passport.initialize());

// v1 api routes
app.use('/', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(404, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
