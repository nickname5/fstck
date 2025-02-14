// movieConsumer.js
const { getChannel } = require('../config/rabbit');
const MovieService = require('../services/movie.service');

const logger = require('../config/logger');
const config = require('../config/config');

async function startConsumer() {
  const channel = await getChannel();

  channel.consume(config.movieRatingsQueue, async (msg) => {
    try {
      const payload = JSON.parse(msg.content.toString());

      if (payload.eventType !== 'RATINGS_IMPORT_CSV_PARSED') {
        logger.info('[MovieConsumer] consumed event:', payload.eventType);
        channel.ack(msg);
        return;
      }

      const { jobId, userId, data: ratings } = payload;
      logger.info(`[MovieConsumer] received ${ratings.length} ratings from user ${userId}`);

      const titles = [...new Set(ratings.map((r) => r.title))];
      const movies = await MovieService.findMoviesByTitles(titles);
      // // Map ratings to include movie IDs
      const enrichedRatings = ratings.map((rating) => {
        const movie = movies.find((m) => m.title === rating.title);
        return {
          ...rating,
          movieId: movie ? movie.id : null,
        };
      }).filter((rating) => rating.movieId !== null);

      logger.info(`[MovieConsumer] enriched ${enrichedRatings.length} ratings`);

      // Publish enriched ratings to exchange
      channel.publish(
        config.ratingImportExchange,
        config.ratingsEnrichedKey,
        Buffer.from(JSON.stringify({
          jobId,
          userId,
          eventType: 'RATINGS_IMPORT_MOVIES_ENRICHED',
          data: enrichedRatings,
        })),
      );

      channel.ack(msg);
    } catch (error) {
      logger.error('[MovieConsumer] Error processing message:', error);
      const headers = msg.properties.headers || {};
      const retries = headers['x-retry-count'] || 0;

      if (retries >= 5) { // Max retries
        channel.publish('ratings_dlq_exchange', 'ratings.dead', msg.content, {
          headers: { ...headers, 'x-retry-count': retries + 1 },
        });
        channel.ack(msg); // Remove from main queue
      } else {
        channel.nack(msg, false, false); // Do not requeue
        channel.sendToQueue(config.movieRatingsQueue, msg.content, {
          headers: { ...headers, 'x-retry-count': retries + 1 },
        });
      }
    }
  });

  logger.info('[MovieConsumer] Started listening for RATINGS_IMPORT_CSV_PARSED events');
}

module.exports = { startConsumer };
