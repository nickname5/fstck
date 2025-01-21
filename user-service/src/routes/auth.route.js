const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const JWT_SECRET = config.jwt.secret;

// 1) Initiate Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// todo: move to auth controller
// 2) Google Callback
//    - If authentication succeeds, we have a `user` from the GoogleStrategy
//    - We'll sign a JWT and return it to the client
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/login-failed' }),
  (req, res) => {
    const user = req.user; // Provided by passport-google-oauth20 on success
    if (!user) return res.redirect('/auth/login-failed');

    // Sign a JWT with user ID
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    // You can choose how to send the token back:
    // - redirect to a frontend route with the token in the URL
    // - set a secure HTTP-only cookie
    // - or return JSON (e.g., for a single-page app)
    // For simplicity, let's just return JSON here:
    return res.json({
      message: 'Login successful',
      token,
    });
  },
);

// 3) Failure or Success pages
router.get('/login-failed', (req, res) => {
  res.send('Login with Google has failed...');
});

module.exports = router;
