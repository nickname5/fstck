const jwt = require('jsonwebtoken');
const config = require('../config/config');

const JWT_SECRET = config.jwt.secret;
const EXPIRATION_TIME = config.jwt.accessExpirationMinutes;

const authenticate = (req, res) => {
  const user = req.user; // Provided by passport-google-oauth20 on success
  if (!user) return res.redirect('/auth/login-failed');

  // Sign a JWT with user ID
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: `${EXPIRATION_TIME}m` });

  // You can choose how to send the token back:
  // - redirect to a frontend route with the token in the URL
  // - set a secure HTTP-only cookie
  // - or return JSON (e.g., for a single-page app)
  // For simplicity, let's just return JSON here:
  return res.json({
    message: 'Login successful',
    token,
  });
};

const loginFailed = (req, res) => {
  res.send('Login with Google has failed...');
};

module.exports = {
  authenticate,
  loginFailed,
};
