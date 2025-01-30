require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// const authMiddleware = require('./middlewares/auth');
const moviesRouter = require('./routes/movies');
const userRouter = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');
const passport = require('passport');

const config = require('./config/config');

const app = express();
require('./libs/passport');

// Logging
app.use(morgan('combined'));

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
app.use('/api/rating', userRouter);

// Error handling
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Gateway running on port ${config.port}`);
});
