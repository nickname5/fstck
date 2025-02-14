const csvParser = require('csv-parser');
const { Readable } = require('stream');
const { v4: uuidv4 } = require('uuid');
const { publishBatch } = require('../publishers/ratingsPublisher');

const BATCH_SIZE = 50;

/** Optional: custom header mapper for IMDb CSV columns */
function imdbHeaderMapper({ header }) {
  switch (header) {
    case 'Your Rating':
      return 'rating';
    case 'Title':
      return 'title';
    case 'Year':
      return 'year';
    case 'Original Title':
      return 'originalTitle';
    default:
      return null; // columns we don't care about become null => ignored by csv-parser
  }
}

/**
 * Streams the CSV from a Buffer, parses it into rows,
 * splits rows into batches, and publishes each batch.
 */
async function processCsv(buffer, userId) {
  return new Promise((resolve, reject) => {
    const jobId = uuidv4();
    const stream = Readable.from(buffer);
    let batch = [];

    // Create CSV stream
    stream
      .pipe(
        csvParser({
          // separator: ';',
          mapHeaders: imdbHeaderMapper,
          // If you want to rename columns or handle no headers, you can pass more options.
        }),
      )
      .on('data', (row) => {
        // Accumulate rows until we hit BATCH_SIZE
        batch.push(row);
        if (batch.length >= BATCH_SIZE) {
          publishBatch(batch, jobId, userId);
          batch = [];
        }
      })
      .on('end', () => {
        // Publish any leftover rows
        if (batch.length > 0) {
          publishBatch(batch, jobId, userId);
        }

        console.log('[ImportService] CSV streaming complete. All batches queued.');
        resolve(); // We’re done processing
      })
      .on('error', (err) => {
        console.error('[ImportService] CSV parsing error:', err);
        reject(err);
      });
  });
}

module.exports = {
  processCsv,
};
