const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3003,
  movieServiceURL: process.env.MOVIE_SERVICE_URL,
  userServiceURL: process.env.USER_SERVICE_URL,
  jwtSecret: process.env.JWT_SECRET,
};
