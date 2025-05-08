const MovieService = require('../services/MovieService');
const Cache = require('../utils/cache');

const logger = require('../config/logger');

const getMovies = async (req, res) => {
  try {
    const filters = req.body.filters || {}; // Extract filters from query parameters
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page

    const result = await MovieService.getMovies(filters, page, limit);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMovie = async (req, res) => {
  try {
    const id = req.params.movieId;

    let movie = await Cache.get(id);
    if (movie) {
      logger.debug(`Cache hit: ${id}, ${movie.title}`);
    } else {
      logger.debug(`Cache miss: ${id}`);
      movie = await MovieService.getMovieById(id);
      if (movie) {
        await Cache.set(id, movie);
      }
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMovies,
  getMovie,
};
