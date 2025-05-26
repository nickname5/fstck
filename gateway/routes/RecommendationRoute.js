const express = require('express');
const proxy = require('express-http-proxy');
const config = require('../config/config');

const router = express.Router();

const aiProxy = proxy(config.movieServiceURL, {
  proxyReqPathResolver: (req) => req.originalUrl.replace('/api/recommendation', '/recommendation'),

  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    if (srcReq.user) {
      proxyReqOpts.headers['x-user-id'] = srcReq.user.userId;
    }
    return proxyReqOpts;
  },
});

router.get('/', (req, res, next) => {
  aiProxy(req, res, next);
});

router.get('/test', (req, res, next) => {
  aiProxy(req, res, next);
});

module.exports = router;
