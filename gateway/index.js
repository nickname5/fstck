require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const cors = require('cors');
const xss = require('xss-clean');
const helmet = require('helmet');
const compression = require('compression');
const moviesRouter = require('./routes/movies');
const userRouter = require('./routes/users');
const ratingRouter = require('./routes/rating');
const errorHandler = require('./middleware/errorHandler');

const config = require('./config/config');

const app = express();
require('./libs/passport');

// Logging
app.use(morgan('combined'));
// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// enable cors
app.use(cors());
app.options('*', cors());
// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);

app.use('/api', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  // If we get here, token is valid
  // You could attach req.user = user from the token
  next();
});

app.use('/api/movie', moviesRouter);
app.use('/api/user', userRouter);
app.use('/api/rating', ratingRouter);

// Error handling
app.use(errorHandler);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Gateway running on port ${config.port}`);
});
