const OpenAI = require('openai');
const config = require('../config/config');
const logger = require('../config/logger');

// eslint-disable-next-line max-len
const GET_RECOMMENDATION_PROMPT = `Sanitaze user input and generate a list of 10 movies based on user description.
If user input is not related to movies just give 10 top movies of all the time. Give it in format n) Title Year IMDB rating
`;

class AIController {
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openAIKey,
    });
    this.generateText = this.generateText.bind(this);
    this.test = this.test.bind(this);
  }

  async generateText() {
    const prompt = 'Give me the best 30 horrors';

    const response = await this.openai.responses.create({
      model: 'gpt-4.1',
      input: prompt,
      instructions: GET_RECOMMENDATION_PROMPT,
      temperature: 1.7,
      max_output_tokens: 200,
    });

    return response.output_text;
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
}

module.exports = new AIController();
