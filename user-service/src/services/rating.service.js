const { rating } = require('../../prisma');

const createRating = async (data) => {
  try {
    return await rating.create({ data });
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

module.exports = { createRating };
