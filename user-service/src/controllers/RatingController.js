const RatingService = require('../services/RatingService');

const addRating = async (req, res) => {
  try {
    const rating = await RatingService.createRating(req.body);
    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserRatings = async (req, res) => {
  try {
    const ratings = await RatingService.getUserRatings(req.params.userId);
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addRating,
  getUserRatings,
};
