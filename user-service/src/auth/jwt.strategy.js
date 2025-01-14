require('dotenv').config();
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const prisma = require('../../prisma');
const config = require('../config/config');

const JWT_SECRET = config.jwt.secret;

const opts = {
  // Look for the token in the Authorization header as a Bearer token
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      // The `jwtPayload` is the decoded token (whatever you put in `sign()`).
      // For example, if we put { userId: ... } in the token, we can retrieve that here.
      const user = await prisma.user.findUnique({
        where: { id: jwtPayload.userId },
      });
      if (user) {
        return done(null, user); // attach user to req.user
      }
      return done(null, false); // user not found
    } catch (error) {
      return done(error, false);
    }
  }),
);

module.exports = passport;
