require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('../../prisma');
const config = require('../config/config');

// Env vars
const { clientID, clientSecret } = config.google;

// Configure Passport with Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: '/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value || null;
        const name = profile.displayName;

        // Find or create user in DB
        let user = await prisma.user.findUnique({ where: { googleId } });

        // If not found by googleId, check by email in case an existing user with same email
        if (!user && email) {
          user = await prisma.user.findUnique({ where: { email } });
        }

        // todo: separate login and sign up
        // potentially add here email verification
        // Create user if not found
        if (!user) {
          user = await prisma.user.create({
            data: { googleId, email, name },
          });
        } else if (!user.googleId) {
          // Optionally update existing user to add GoogleId
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId },
          });
        }

        // Instead of calling done() with user object (for sessions),
        // we'll embed user info in the callback so that we can sign a JWT
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

module.exports = passport;
