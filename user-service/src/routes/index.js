const express = require('express');
const authRoute = require('./AuthRoute');
const userRoute = require('./UserRoute');
const ratingRoute = require('./RatingRoute');

const router = express.Router();

const routes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/rating',
    route: ratingRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
