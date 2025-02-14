const { getChannel } = require('../config/rabbit');
const config = require('../config/config');

async function publishBatch(batch, jobId, userId) {
  // console.log('[ratingsPublisher] Publishing batch:', batch);

  const channel = await getChannel();
  const payload = {
    jobId,
    userId,
    eventType: 'RATINGS_IMPORT_CSV_PARSED',
    data: batch,
  };
  channel.publish(
    config.ratingImportExchange,
    config.ratingsImportKey,
    Buffer.from(JSON.stringify(payload)),
  );
}

module.exports = {
  publishBatch,
};
