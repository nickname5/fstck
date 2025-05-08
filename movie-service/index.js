const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { connectRabbit } = require('./config/rabbit'); // → return { connection, channel }
const { startConsumer } = require('./consumers/importConsumer');
const { connectRedis } = require('./config/redis'); // → return redisClient

const resources = {
  httpServer: null,
  mongo: null,
  rabbitConn: null,
  rabbitChan: null,
  redis: null,
};

async function openResources() {
  // MongoDB
  resources.mongo = await mongoose.connect(config.mongoose.url, config.mongoose.options);
  logger.info('Connected to MongoDB');

  // RabbitMQ
  const { connection, channel } = await connectRabbit();
  resources.rabbitConn = connection;
  resources.rabbitChan = channel;
  logger.info('Connected to RabbitMQ');

  // Redis
  resources.redis = await connectRedis();
  logger.info('Connected to Redis');

  // Kick off consumer (returns a promise you can await if you want)
  await startConsumer();
  logger.info('Import consumer started');
}

async function closeResources(exitCode = 0) {
  try {
    // Stop HTTP first so we don’t accept new work
    if (resources.httpServer) {
      await new Promise((res) => resources.httpServer.close(res));
      logger.info('HTTP server closed');
    }

    // Mongo
    if (resources.mongo) {
      await mongoose.disconnect();
      logger.info('MongoDB disconnected');
    }

    // RabbitMQ
    if (resources.rabbitChan) await resources.rabbitChan.close();
    if (resources.rabbitConn) await resources.rabbitConn.close();
    logger.info('RabbitMQ closed');

    // Redis
    if (resources.redis) {
      await resources.redis.quit();
      logger.info('Redis connection closed');
    }
  } catch (err) {
    logger.error('Error during shutdown: ', err);
    process.exit(exitCode || 1);
  } finally {
    // Ensure we always exit
    process.exit(exitCode);
  }
}

process.on('SIGINT', () => { logger.warn('SIGINT received'); closeResources(0); });
process.on('SIGTERM', () => { logger.warn('SIGTERM received'); closeResources(0); });

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection: ', reason);
  closeResources(1);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception: ', err);
  closeResources(1);
});

(async function start() {
  try {
    await openResources();
    resources.httpServer = app.listen(config.port, () => logger.info(`Movie-service listening on :${config.port}`));
  } catch (err) {
    logger.error('Startup failed: ', err);
    /* if openResources threw, some handles may still be live */
    await closeResources(1);
  }
}());
