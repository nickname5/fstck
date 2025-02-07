const csvParser = require('csv-parser');
const { Readable } = require('stream');

const BATCH_SIZE = 10;
// const IMDB_HEADERS = ['Const', 'Your Rating', 'Date Rated', 'Title', 'Original Title', 'URL', 'Title Type', 'IMDb Rating', 'Runtime (mins)', 'Year'];

const publishBatch = (batch) => {
  console.log('publishing batch', batch);
};

const imdbHeaderMapper = ({ header }) => {
  switch (header) {
    case 'Your Rating':
      return 'rating';
    case 'Title':
    case 'Year':
      return header.toLowerCase();
    case 'Original Title':
      return 'originalTitle';
    default:
      return null;
  }
};

const importRatings = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const stream = Readable.from(req.file.buffer);

    let batch = [];

    stream
      // If your CSV has headers, you can pass { headers: true } to map columns properly
      .pipe(csvParser({ separator: ';', mapHeaders: imdbHeaderMapper }))
      .on('data', async (row) => {
        batch.push(row);

        // Once we reach BATCH_SIZE, publish it to the queue and reset the batch
        if (batch.length >= BATCH_SIZE) {
          publishBatch(batch);
          batch = [];
        }
      })
      .on('end', async () => {
        // If there's a remainder batch after streaming ends, publish it too
        if (batch.length > 0) {
          await publishBatch(batch);
        }

        console.log('CSV streaming complete. All batches queued.');
        return res.json({ message: 'File received and is being processed in batches.' });
      })
      .on('error', (err) => {
        console.error('CSV parsing error:', err);
        return res.status(500).json({ error: 'CSV parsing error.' });
      });
  } catch (error) {
    console.error('Error in /upload route:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = {
  importRatings,
};
