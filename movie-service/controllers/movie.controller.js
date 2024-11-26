const MovieService = require('../services/movie.service');

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
    const movie = await MovieService.getMovieById(req.params.movieId);
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMovies,
  getMovie,
};
