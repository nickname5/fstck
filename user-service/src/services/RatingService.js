const { rating } = require('../../prisma');

const createRating = async (data) => {
  try {
    return await rating.create({ data });
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

const createRatings = async (data, userId) => {
  try {
    const ratings = data.map((r) => ({
      userId,
      movieId: r.movieId,
      rating: parseInt(r.rating),
    }));
    return await rating.createMany({ data: ratings, skipDuplicates: true });
  } catch (error) {
    throw new Error(`Error saving ratings: ${error.message}`);
  }
};

const getUserRatings = async (userId) => {
  try {
    return await rating.findMany({
      where: { userId },
      select: {
        movieId: true,
        rating: true,
      },
    });
  } catch (error) {
    throw new Error(`Error getting user ratings: ${error.message}`);
  }
}

module.exports = { createRating, createRatings, getUserRatings };
