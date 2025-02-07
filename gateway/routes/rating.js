const express = require('express');
const proxy = require('express-http-proxy');
const multer = require('multer');
const config = require('../config/config');

const upload = multer({ storage: multer.memoryStorage() });
const importController = require('../controllers/import.controller');

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
router.post('/import', upload.single('file'), importController.importRatings);

module.exports = router;
