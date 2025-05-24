const express = require('express');
// const authRoute = require('./auth.route');
const movieRoute = require('./MovieRoute');
const aiRoute = require('./AIRoute');

const router = express.Router();

const routes = [
  {
    path: '/movie',
    route: movieRoute,
  },
  {
    path: '/ai',
    route: aiRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
