const express = require('express');
// const authRoute = require('./auth.route');
const movieRoute = require('./MovieRoute');

const router = express.Router();

const routes = [
  // {
  //   path: '/auth',
  //   route: authRoute,
  // },
  {
    path: '/movie',
    route: movieRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
