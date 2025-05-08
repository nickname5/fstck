const { getChannel } = require('../config/rabbit');
const RatingService = require('../services/RatingService');
const logger = require('../config/logger');
const config = require('../config/config');

async function startConsumer() {
  const channel = await getChannel();

  channel.consume(config.userRatingsQueue, async (msg) => {
    try {
      const payload = JSON.parse(msg.content.toString());
      if (payload.eventType !== 'RATINGS_IMPORT_MOVIES_ENRICHED') {
        logger.info('[UserConsumer] Skipping unrelated event:', payload.eventType);
        channel.ack(msg);
        return;
      }

      const { jobId, userId, data: ratings } = payload;
      logger.info(`[UserConsumer] received ${ratings.length} enriched ratings`);

      await RatingService.createRatings(ratings, userId);
      logger.info('[UserConsumer] saved ratings to database');

      channel.ack(msg);
    } catch (error) {
      logger.error('[UserConsumer] Error processing message:', error);
      const headers = msg.properties.headers || {};
      const retries = headers['x-retry-count'] || 0;

      if (retries >= 5) { // Max retries
        channel.publish('ratings_dlq_exchange', 'ratings.dead', msg.content, {
          headers: { ...headers, 'x-retry-count': retries + 1 },
        });
        channel.ack(msg); // Remove from main queue
      } else {
        channel.nack(msg, false, false); // Do not requeue
        channel.sendToQueue(config.userRatingsQueue, msg.content, {
          headers: { ...headers, 'x-retry-count': retries + 1 },
        });
      }
    }
  });

  logger.info('[UserConsumer] Started listening for MOVIES_ENRICHED events');
}

module.exports = { startConsumer };
