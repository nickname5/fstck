const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  postgres: {
    url: process.env.POSTGRES + (process.env.NODE_ENV === 'test' ? '-test' : ''),
    options: {},
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  rabbitURL: process.env.RABBIT_URL || 'amqp://admin:admin@localhost:5672',
  ratingImportExchange: process.env.RABBIT_IMPORT_EXCHANGE || 'ratings_import_exchange',
  movieRatingsQueue: process.env.MOVIE_RATINGS_QUEUE || 'movie_ratings_queue',
  userRatingsQueue: process.env.USER_RATINGS_QUEUE || 'user_ratings_queue',
  ratingsImportKey: process.env.ROUTING_KEY_RATINGS_IMPORT || 'ratings.import',
  ratingsEnrichedKey: process.env.ROUTING_KEY_RATINGS_ENRICHED || 'ratings.enriched',
};
