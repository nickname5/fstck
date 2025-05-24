const express = require('express');
const AIController = require('../controllers/AIController');

const router = express.Router();

router
  .route('/')
  .get(AIController.test);

module.exports = router;
