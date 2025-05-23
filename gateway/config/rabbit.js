const amqp = require('amqplib');

let connection;
let channel;

const config = require('./config');

async function connectRabbit() {
  if (channel) return channel;

  // Create a connection if not already
  if (!connection) {
    connection = await amqp.connect(config.rabbitURL);
    console.log('[Rabbit] Connected to', config.rabbitURL);
  }

  // Create a channel
  channel = await connection.createChannel();
  console.log('[Rabbit] Channel created');
  await channel.assertExchange(config.ratingImportExchange, 'direct', { durable: true });
  await channel.assertQueue(config.movieRatingsQueue, {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': 'ratings_dlq_exchange', // Exchange for dead-letter queue
      'x-message-ttl': 60000, // Optional: Retry after 60 seconds
      'x-dead-letter-routing-key': 'ratings.dead', // Routing key for DLQ
    },
  });
  await channel.assertExchange('ratings_dlq_exchange', 'direct', { durable: true });
  await channel.assertQueue('user_ratings_dlq', { durable: true });
  await channel.bindQueue('user_ratings_dlq', 'ratings_dlq_exchange', 'ratings.dead');
  await channel.bindQueue(
    config.movieRatingsQueue,
    config.ratingImportExchange,
    config.ratingsImportKey,
  );
  console.log('[Rabbit] Queue created');
  return { channel, connection };
}

async function getChannel() {
  if (channel) return channel;

  throw Error("RabbitMQ channel not initialized. Call 'connectRabbit' first.");
}

module.exports = { getChannel, connectRabbit };
