const express = require('express');
const passport = require('passport');
const RatingController = require('../controllers/RatingController');

const router = express.Router();

router
  .route('/')
  .post(passport.authenticate('jwt', { session: false }), RatingController.addRating);

module.exports = router;
