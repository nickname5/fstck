const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongoose: {
    url: process.env.MONGODB_URL + (process.env.NODE_ENV === 'test' ? '-test' : ''),
    options: {},
  },
  redisPort: process.env.REDIS_PORT || '6379',
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisURL: process.env.REDIS_URL || 'redis://localhost:6379',
  rabbitURL: process.env.RABBIT_URL || 'amqp://admin:admin@localhost:5672',
  ratingImportExchange: process.env.RABBIT_IMPORT_EXCHANGE || 'ratings_import_exchange',
  movieRatingsQueue: process.env.MOVIE_RATINGS_QUEUE || 'movie_ratings_queue',
  userRatingsQueue: process.env.USER_RATINGS_QUEUE || 'user_ratings_queue',
  ratingsImportKey: process.env.ROUTING_KEY_RATINGS_IMPORT || 'ratings.import',
  ratingsEnrichedKey: process.env.ROUTING_KEY_RATINGS_ENRICHED || 'ratings.enriched',
};
