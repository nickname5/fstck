const express = require('express');
const proxy = require('express-http-proxy');
const config = require('../config/config');

const router = express.Router();

const ratingProxy = proxy(config.userServiceURL, {
  proxyReqPathResolver: (req) => req.originalUrl.replace('/api/rating', '/rating'),
});

router.get('/', (req, res, next) => {
  ratingProxy(req, res, next);
});
router.post('/', (req, res, next) => {
  ratingProxy(req, res, next);
});
router.get('/import', (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('import', req.body);
});

module.exports = router;
