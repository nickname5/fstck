const express = require('express');
// const auth = require('../../middlewares/auth');
// const validate = require('../../middlewares/validate');
// const userValidation = require('../../validations/user.validation');
const movieController = require('../controllers/movie.controller');

const router = express.Router();

router
  .route('/')
  .get(movieController.getMovies)
  .post(movieController.getMovies);

router
  .route('/:movieId')
  .get(movieController.getMovie);

module.exports = router;
