const express = require('express');
const proxy = require('express-http-proxy');
const config = require('../config/config');

const router = express.Router();

const usersProxy = proxy(config.userServiceURL, {
  proxyReqPathResolver: (req) => req.originalUrl.replace('/api/user', '/user'),
});

router.get('/', (req, res, next) => {
  usersProxy(req, res, next);
});
router.post('/', (req, res, next) => {
  usersProxy(req, res, next);
});

module.exports = router;
