const express = require('express');
const MovieController = require('../controllers/MovieController');

const router = express.Router();

router
  .route('/')
  .get(MovieController.getMovies)
  .post(MovieController.getMovies);

router
  .route('/:movieId')
  .get(MovieController.getMovie);

module.exports = router;
