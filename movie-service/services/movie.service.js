const Movie = require('../models/movie');

/**
 * Fetch all movies with optional filters and pagination.
 * @param {Object} filters - Filters to apply (e.g., genre, year).
 * @param {Number} page - Page number (default is 1).
 * @param {Number} limit - Number of items per page (default is 10).
 * @returns {Promise<Object>} - Paginated result with movies and metadata.
 */
const getMovies = async (filters = {}, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
    const movies = await Movie
      .find({ 'imdb.rating': { $type: 'number' } })
      .sort({ 'imdb.rating': -1 }).skip(skip).limit(limit);
    const total = await Movie.countDocuments(filters); // Total number of matching documents
    return {
      movies,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error(`Error fetching movies: ${error.message}`);
  }
};

/**
 * Fetch a single movie by ID.
 * @param {String} id - Movie ID.
 * @returns {Promise<Object>} - The movie document.
 */
const getMovieById = async (id) => {
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      throw new Error(`Movie with ID ${id} not found`);
    }
    return movie;
  } catch (error) {
    throw new Error(`Error fetching movie by ID: ${error.message}`);
  }
};

module.exports = {
  getMovies,
  getMovieById,
};
