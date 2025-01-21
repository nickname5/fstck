const RatingService = require('../services/rating.service');

const addRating = async (req, res) => {
  try {
    const rating = await RatingService.createRating(req.body);
    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addRating,
};
