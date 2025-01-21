const express = require('express');
const passport = require('passport');
const ratingController = require('../controllers/rating.controller');

const router = express.Router();

router
  .route('/')
  .post(passport.authenticate('jwt', { session: false }), ratingController.addRating);

module.exports = router;
