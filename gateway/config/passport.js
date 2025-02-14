// gateway/passport.js
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      // At this point, the token's signature has been verified,
      // and jwtPayload is the decoded token object: e.g. { userId, iat, exp, ... }

      // If you want to do additional checks:
      // e.g., call user-service to confirm user still exists or is not banned:
      // const user = await getUserFromUserService(jwtPayload.userId);
      // if (!user) return done(null, false);

      // If everything is good, attach payload or user object to req.user
      return done(null, jwtPayload);
    } catch (error) {
      // If there's an error or token is invalid
      return done(error, false);
    }
  }),
);

module.exports = passport;
