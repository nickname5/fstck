const router = require('express').Router();
const passport = require('passport');
const AuthController = require('../controllers/AuthController');

// 1) Initiate Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2) Google Callback
//    - If authentication succeeds, we have a `user` from the GoogleStrategy
//    - We'll sign a JWT and return it to the client
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/login-failed' }),
  AuthController.authenticate,
);

// 3) Failure or Success pages
router.get('/login-failed', AuthController.loginFailed);

module.exports = router;
