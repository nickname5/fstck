const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { connectRabbit } = require('./config/rabbit');
const { startConsumer } = require('./consumers/importConsumer');
const { connectRedis } = require('./config/redis');

let server;

const startServer = async () => {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');
    await connectRabbit();
    logger.info('Connected to RabbitMQ');
    await connectRedis();
    logger.info('Connected to Redis');
    await startConsumer();
    logger.info('Started import consumer');
    // redis
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  } catch (e) {
    logger.error('Movie service startup failed');
  }
};

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

startServer();

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

// todo: close connections?!

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
