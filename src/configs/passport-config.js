// const passport = require("passport");
// const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
// const User = require("../models/user-model");

// const jwtOptions = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: "SECRETKEY", // Replace with your secret key for signing and verifying tokens
// };

// const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
//   try {
//     const user = await User.findById(payload.sub); // Replace with your User model method to find a user by ID
//     if (user) {
//       return done(null, user);
//     } else {
//       return done(null, false);
//     }
//   } catch (error) {
//     return done(error, false);
//   }
// });

// module.exports = jwtStrategy;

// passport-config.js
const passport = require("passport");
const passportJwt = require("passport-jwt");
const User = require("./user");

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "SECRET",
};

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.userId);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
