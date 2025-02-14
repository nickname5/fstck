const importService = require('../services/import.service');

/**
 * Controller method for importing ratings from a CSV file.
 */
async function importRatings(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Hand off the buffer to our importService
    await importService.processCsv(req.file.buffer, req.user.userId);

    // We respond immediately after streaming starts, not waiting for entire processing
    // (though below we do 'await' on the Promise to ensure streaming completes, you could
    // also choose to do it in background if you prefer)
    return res.json({ message: 'File received and is being processed in batches.' });

  } catch (error) {
    console.error('Error in importRatings controller:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  importRatings,
};
