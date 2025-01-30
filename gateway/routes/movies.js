const express = require('express');
const proxy = require('express-http-proxy');
const config = require('../config/config');

const router = express.Router();

const moviesProxy = proxy(config.movieServiceURL, {
  proxyReqPathResolver: (req) => req.originalUrl.replace('/api/movie', '/movie'),
});

router.get('/', (req, res, next) => {
  moviesProxy(req, res, next);
});

router.get('/:movieId', (req, res, next) => {
  moviesProxy(req, res, next);
});

module.exports = router;
