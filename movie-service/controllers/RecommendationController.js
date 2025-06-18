const OpenAI = require('openai');
const config = require('../config/config');
const logger = require('../config/logger');
const axios = require('axios');
const MovieService = require('../services/MovieService');

// eslint-disable-next-line max-len
const GET_RECOMMENDATION_INSTRUCTIONS = `
You are a movie-recommendation engine.

• You will receive ONE JSON array called "ratings".
  – Each element has "title" and "rating".
  – Every title in this list has ALREADY been watched by the user.

• Your task: suggest up to 20 OTHER movies the user is likely to enjoy.
  – ABSOLUTELY do NOT include any title that appears in "ratings".
  – Do not explain your reasoning.

  Return the result ONLY by calling the function recommend_movies, whose
schema is provided. Do not output anything else.`

const instr = `
You are a movie-recommendation engine.

• The array "watched" contains titles the user ALREADY saw.
• The array "ratings" contains those same movies with scores.
Return up to 20 NEW movies, not present in "watched".
Respond ONLY via the function recommend_movies.
`;
const fewShotsMessages = [
  {
    role: "user",
    content: '{"watched":["Titanic"],"ratings":[{"title":"Titanic","rating":10}]}'
  },
  {
    role: "assistant",
    content: 'Titanic, Avatar'
  },
  {
    role: "system",
    content: "❌ Invalid.  This answer repeats a watched title."
  },
  {
    role: "user",
    content: '{"watched":["Titanic"],"ratings":[{"title":"Titanic","rating":10}]}'
  },
  {
    role: "assistant",
    content:
      'Function call: recommend_movies({"movies":[{"title":"Avatar"},{"title":"The Abyss"}]})'
  },
  {
    role: "system",
    content: "✅ Correct.  No watched titles are repeated."
  },
];

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
    const watchedTitles = ratings.map(r => r.title);

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        { role: "system", content: instr },
        ...fewShotsMessages,
        {
          role: "user",
          content: JSON.stringify({ watched: watchedTitles, ratings })
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "recommend_movies",
            description: "Return up to 20 new movie recommendations",
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
      logger.debug(`getting ai recommendations with ${ratings.length} ratings`);
      const result = await this.getAiRecommendations(ratings);
      console.log("ai result", result);
      const recommendationMovies = await MovieService.findMoviesByTitles(result);
      // console.log("recommendationMovies", recommendationMovies.map((m) => m.title));
      // const duplicates = recommendationMovies
      //   .filter((movie) => userMoviesIdRatingMap[movie._id])
      //   .map((movie) => ({ title: movie.title, year: movie.year, id: movie._id}));
      // console.log("duplicates", duplicates);
      res.status(200).json(recommendationMovies);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new RecommendationController();
