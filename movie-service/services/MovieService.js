const Movie = require('../models/movie');
const { mapFilters } = require('../utils/mappers');
const logger = require('../config/logger');

const movieProjection = {
  title: 1,
  imdb: 1,
  genres: 1,
  year: 1,
  _id: 1,
  cast: 1,
  directors: 1,
  plot: 1,
  fullplot: 1,
  runtime: 1,
};

const recommendationProjection = {
  _id: 1,
  year: 1,
  title: 1,
}

const getMovies = async (filters = {}, page = 1, limit = 10) => {
  try {
    const resultLimit = limit < 100 ? limit : 100; // Limit the number of items per page to 100
    const skip = (page - 1) * resultLimit; // Calculate the number of documents to skip
    const resultFilters = mapFilters(filters);

    logger.info(`Fetching movies with filters: ${JSON.stringify(resultFilters)}`);

    const movies = await Movie
      .find({
        'imdb.rating': { $type: 'number' }, // not null rating
        ...resultFilters,
      })
      .select(movieProjection)
      .sort({ 'imdb.rating': -1 }).skip(skip)
      .limit(resultLimit);

    const total = await Movie.countDocuments(resultFilters); // Total number of matching documents
    return {
      movies,
      metadata: {
        total,
        page,
        limit: resultLimit,
        totalPages: Math.ceil(total / resultLimit),
        filters,
      },
    };
  } catch (error) {
    throw new Error(`Error fetching movies: ${error.message}`);
  }
};

const getMovieById = async (id) => {
  try {
    return await Movie.findById(id);
  } catch (error) {
    throw new Error(`Error fetching movie by ID: ${error.message}`);
  }
};

const findMoviesByTitles = async (titles) => {
  try {
    return await Movie.find({ title: { $in: titles } }).lean();
  } catch (error) {
    throw new Error(`Error fetching movies by titles: ${error.message}`);
  }
};

const getMoviesByIds = async (ids) => {
  try {
    return await Movie.find({ _id: { $in: ids } }).select(recommendationProjection).lean();
  } catch (error) {
    throw new Error(`Error fetching movies by titles: ${error.message}`);
  }
};

module.exports = {
  getMovies,
  getMovieById,
  findMoviesByTitles,
  getMoviesByIds,
};
