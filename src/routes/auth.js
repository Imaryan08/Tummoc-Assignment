const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../models/user-model");

const router = express.Router();

// Set up JWT secret key
const secretKey = "SECRET";

// Configure passport JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
};

passport.use(
  new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    User.findById(jwtPayload.userId)
      .then((user) => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch((err) => done(err, false));
  })
);

// Login route
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Find the user in the database
  User.findOne({ username })
    .then((user) => {
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the password is correct
      if (password !== user.password) {
        return res.status(401).json({ error: "Incorrect password" });
      }

      // If the user is authenticated, generate and send a JWT token
      const token = jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: "1h",
      });
      res.json({ token });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
});

// Logout route
router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Perform any necessary logout operations, such as invalidating the token

    // Invalidate the JWT token by setting its expiration to the current time
    const token = req.headers.authorization.split(" ")[1]; // Assuming the token is sent in the Authorization header
    const decodedToken = jwt.decode(token);
    decodedToken.exp = Date.now() / 1000; // Set expiration time to current time
    const invalidatedToken = jwt.sign(decodedToken, secretKey);
    res.json({ message: "Logged out successfully" });
  }
);

module.exports = router;
