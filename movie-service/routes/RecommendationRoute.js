const express = require('express');
const RecommendationController = require('../controllers/RecommendationController');

const router = express.Router();

router
  .route('/')
  .get(RecommendationController.getRecommendation);

module.exports = router;
