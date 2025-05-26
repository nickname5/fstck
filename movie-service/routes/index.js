const express = require('express');
// const authRoute = require('./auth.route');
const movieRoute = require('./MovieRoute');
const recommendationRoute = require('./RecommendationRoute');

const router = express.Router();

const routes = [
  {
    path: '/movie',
    route: movieRoute,
  },
  {
    path: '/recommendation',
    route: recommendationRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
