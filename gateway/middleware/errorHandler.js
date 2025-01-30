module.exports = function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid or missing token.' });
  }
  return res.status(500).json({ error: err.message || 'Internal Server Error' });
};
