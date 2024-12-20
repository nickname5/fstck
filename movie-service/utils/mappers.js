const Joi = require('joi');

// Validation schema for filters
const filterSchema = Joi.object({
  minVotes: Joi.number().integer().min(0),
  minRating: Joi.number().min(0).max(10),
  genres: Joi.array().items(Joi.string()),
  minYear: Joi.number().integer().min(1880), // Start year
  maxYear: Joi.number().integer().min(1880), // End year
  actor: Joi.string(),
  director: Joi.string(),
  keyword: Joi.string(),
  runtime: Joi.object({
    min: Joi.number().integer().min(0),
    max: Joi.number().integer().min(0),
  }),
});

// Map filters to MongoDB query
const mapFilters = (filters) => {
  // Validate and sanitize filters
  const { error, value: validatedFilters } = filterSchema.validate(filters, {
    stripUnknown: true,
  });

  if (error) {
    throw new Error(`Invalid filters: ${error.message}`);
  }

  const query = {};

  if (validatedFilters.minVotes) {
    query['imdb.votes'] = { $gte: validatedFilters.minVotes };
  }

  if (validatedFilters.minRating) {
    query['imdb.rating'] = { ...query['imdb.rating'], $gte: validatedFilters.minRating };
  }

  if (validatedFilters.genres) {
    query.genres = { $in: validatedFilters.genres }; // todo: fix, at the moment it's an OR
  }

  if (validatedFilters.minYear || validatedFilters.maxYear) {
    query.year = {};
    if (validatedFilters.minYear) {
      query.year.$gte = validatedFilters.minYear;
    }
    if (validatedFilters.maxYear) {
      query.year.$lte = validatedFilters.maxYear;
    }
  }

  if (validatedFilters.actor) {
    query.cast = { $in: [validatedFilters.actor] };
  }

  if (validatedFilters.director) {
    query.directors = { $in: [validatedFilters.director] };
  }

  // Map keyword (search in plot, title, and fullplot)
  if (validatedFilters.keyword) {
    const keywordRegex = new RegExp(validatedFilters.keyword, 'i'); // Case-insensitive regex
    query.$or = [
      { title: keywordRegex },
      { plot: keywordRegex },
      { fullplot: keywordRegex },
    ];
  }

  // Map runtime
  if (validatedFilters.runtime) {
    query.runtime = {};
    if (validatedFilters.runtime.min) {
      query.runtime.$gte = validatedFilters.runtime.min;
    }
    if (validatedFilters.runtime.max) {
      query.runtime.$lte = validatedFilters.runtime.max;
    }
  }

  return query;
};

module.exports = {
  mapFilters,
};
