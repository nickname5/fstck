const OpenAI = require('openai');
const config = require('../config/config');
const logger = require('../config/logger');
const axios = require('axios');
const MovieService = require('../services/MovieService');

// eslint-disable-next-line max-len
const GET_RECOMMENDATION_INSTRUCTIONS = `Give me a formatted list of movies that user hasn't seen but high likely would
 like, based on provided user ratings. Limit the list to 50 items`;

const movieRecommendationSchema = {
  type: "object",
  properties: {
    movies: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
        },
        required: ["title"],
      },
    },
  },
  required: ["movies"],
};

class RecommendationController {
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openAIKey,
    });
    this.getAiRecommendations = this.getAiRecommendations.bind(this);
    this.test = this.test.bind(this);
    this.getRecommendation = this.getRecommendation.bind(this);
  }

  async getAiRecommendations(ratings) {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        { role: "system", content: GET_RECOMMENDATION_INSTRUCTIONS },
        {
          role: "user",
          content: `Here are the user’s ratings:\n${JSON.stringify(ratings, null, 2)}`,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "recommend_movies",
            description: "Return a list of movie recommendations",
            parameters: movieRecommendationSchema,
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "recommend_movies" } },
    });

    const toolCall = response.choices[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("No tool call returned by AI");
    }

    const parsed = JSON.parse(toolCall.function.arguments);
    const recommendedTitles = parsed.movies.map((m) => m.title);

    return recommendedTitles;
  }

  async test(req, res) {
    try {
      const response = await this.generateText();
      res.status(200).json({ response });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  async getRecommendation(req, res) {
    try {
      const userId = req.headers['x-user-id'];
      const ratingsResponse = await axios.get(`${config.userServiceURL}/rating/user-ratings/${userId}`, {
        headers: {
          Authorization: req.headers.authorization,
        },
      });
      const userMoviesIdRatingMap = {};
      ratingsResponse.data.forEach((item, acc) => {
        userMoviesIdRatingMap[item.movieId] = item.rating;
      });
      const userMovies = await MovieService
        .getMoviesByIds(Object.keys(userMoviesIdRatingMap));

      const ratings = userMovies.map((movie) => ({
        title: movie.title,
        year: movie.year,
        rating: userMoviesIdRatingMap[movie._id],
      }));
      const result = await this.getAiRecommendations(ratings);
      const recommendationMovies = await MovieService.findMoviesByTitles(result);
      res.status(200).json(recommendationMovies);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new RecommendationController();
