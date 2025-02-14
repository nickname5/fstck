const { PrismaClient } = require('@prisma/client');
const config = require('./config/config');
const logger = require('./config/logger');
const { connectRabbit } = require('./config/rabbit');
const { startConsumer } = require('./consumers/importConsumer');

const prisma = new PrismaClient();
let server;
const app = require('./app');

prisma.$connect().then(() => {
  logger.info('Connected to PostgreSQL');

  connectRabbit().then(() => {
    logger.info('Connected to RabbitMQ');
    startConsumer();
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  });
}).catch((error) => {
  logger.error('Error connecting to PostgreSQL:', error);
  process.exit(1); // Exit the process if the database connection fails
});

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

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
