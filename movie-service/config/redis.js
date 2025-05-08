const redis = require('redis');

let client;

const config = require('./config');
const logger = require('./logger');

async function connectRedis() {
  if (client) return client;

  try {
    client = await redis.createClient({
      port: config.redisPort,
      host: config.redisHost,
    })
      .on('error', (err) => logger.error('Redis Client Error', err))
      .connect();

    return client;
  } catch (e) {
    logger.error('Redis startup has failed', e);
  }
}

function getClient() {
  if (client) return client;

  throw Error('Redis client is not initialized');
}

module.exports = { getClient, connectRedis };
