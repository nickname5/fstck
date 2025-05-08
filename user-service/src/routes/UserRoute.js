const express = require('express');
const passport = require('passport');
const UserController = require('../controllers/UserController');

const router = express.Router();

require('../auth/jwtStrategy');

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), UserController.getUsers)
  .post(UserController.createUser);

module.exports = router;
