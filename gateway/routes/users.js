const express = require('express');
const proxy = require('express-http-proxy');
const config = require('../config/config');

const router = express.Router();

const usersProxy = proxy(config.userServiceURL, {
  proxyReqPathResolver: (req) => {
    if (req.originalUrl.includes('/api/user')) {
      return req.originalUrl.replace('/api/user', '/user');
    }

    if (req.originalUrl.includes('/api/rating')) {
      return req.originalUrl.replace('/api/rating', '/rating');
    }

    return req.originalUrl;
  },
});

router.get('/', (req, res, next) => {
  usersProxy(req, res, next);
});
router.post('/', (req, res, next) => {
  usersProxy(req, res, next);
});

module.exports = router;
