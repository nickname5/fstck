const express = require('express');
// const auth = require('../../middlewares/auth');
// const validate = require('../../middlewares/validate');
// const userValidation = require('../../validations/user.validation');
const passport = require('passport');
const userController = require('../controllers/user.controller');

const router = express.Router();

require('../auth/jwt.strategy');

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), userController.getUsers)
  .put(userController.createUser);

module.exports = router;
