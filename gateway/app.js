const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const cors = require('cors');
const xss = require('xss-clean');
const helmet = require('helmet');
const compression = require('compression');
const moviesRouter = require('./routes/MovieRoute');
const userRouter = require('./routes/UserRoute');
const ratingRouter = require('./routes/RatingRoute');
const aiRouter = require('./routes/AIRoute');
const errorHandler = require('./middleware/errorHandler');

const app = express();
require('./config/passport');

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
app.use('/api/ai', aiRouter);

// Error handling
app.use(errorHandler);

module.exports = app;
