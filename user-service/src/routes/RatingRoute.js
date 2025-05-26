const express = require('express');
const passport = require('passport');
const RatingController = require('../controllers/RatingController');

const router = express.Router();

router
  .route('/')
  .post(passport.authenticate('jwt', { session: false }), RatingController.addRating);

router
  .route('/user-ratings/:userId')
  .get(passport.authenticate('jwt', { session: false }), RatingController.getUserRatings);

module.exports = router;
